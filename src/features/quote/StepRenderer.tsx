"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/Input";
import { Radio } from "@/components/ui/Radio";
import { Textarea } from "@/components/ui/Textarea";
import { cn } from "@/lib/cn";
import {
  getNextOutcome,
  getPreviousStep,
  getStepCount,
  type QuoteField,
  type QuoteFieldKey,
  type QuoteFlow,
  type QuoteFormState,
  type QuoteFormValue,
  type QuoteService,
  type QuoteStep,
  type QuoteStepOption,
} from "@/lib/quote/schema";

const STORAGE_KEY = "mitchdesigns.quote.lead";

type StepRendererProps = {
  service: QuoteService;
  flow: QuoteFlow;
  step: QuoteStep;
};

type StoredLead = QuoteFormState & {
  firstName?: string;
  service?: QuoteService;
};

type ErrorMap = Partial<Record<QuoteFieldKey, string>>;

export function StepRenderer({ service, flow, step }: StepRendererProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [state, setState] = useState<StoredLead>({});
  const [errors, setErrors] = useState<ErrorMap>({});
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  useEffect(() => {
    setState(readStoredLead());
    setErrors({});
    setUploadedFile(null);
  }, [service, step.step]);

  const hydratedTitle = useMemo(() => {
    const fallbackName = "there";
    const firstName =
      typeof state.firstName === "string" && state.firstName.trim()
        ? state.firstName.trim()
        : fallbackName;

    return step.title.replace("{firstName}", firstName);
  }, [state.firstName, step.title]);

  const progressLabel = `Step ${step.step} of ${getStepCount(service)}`;

  const currentFileName = useMemo(() => {
    if (uploadedFile) return uploadedFile.name;
    const stored = state[step.id];
    if (
      typeof stored === "object" &&
      stored !== null &&
      "name" in stored &&
      typeof (stored as { name: unknown }).name === "string"
    ) {
      return (stored as { name: string }).name;
    }
    return null;
  }, [uploadedFile, state, step.id]);

  function updateValue(key: QuoteFieldKey, value: QuoteFormValue) {
    setState((current) => {
      const next = { ...current, [key]: value };
      writeStoredLead(next);
      return next;
    });
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function goBack() {
    const previousStep = getPreviousStep(service, step.step);
    if (previousStep) {
      router.push(`/quote/${service}/${previousStep}`);
      return;
    }

    router.push("/quote");
  }

  function submitStep(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateStep(step, state, uploadedFile);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const stepValue = state[step.id];
    const selectedValue = typeof stepValue === "string" ? stepValue : undefined;
    const outcome = getNextOutcome(service, step.step, selectedValue);

    if (outcome.type === "route") {
      router.push(outcome.href);
      return;
    }

    router.push(`/quote/${service}/${outcome.step}`);
  }

  return (
    <section className="container-page flex min-h-[calc(100dvh-4rem)] items-start justify-center py-8 md:items-center md:py-12">
      <form
        onSubmit={submitStep}
        className="relative w-full max-w-[790px] rounded-card-sm bg-bg px-6 py-9 shadow-soft-lg ring-1 ring-border md:px-12 md:py-11"
      >
        <button
          type="button"
          aria-label="Back"
          onClick={goBack}
          className="absolute left-6 top-9 grid h-9 w-9 place-items-center rounded-full text-fg transition-colors hover:bg-bg-alt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:left-10"
        >
          <Icon size={22}>
            <path d="M15 18l-6-6 6-6" />
          </Icon>
        </button>

        <p className="sr-only">
          {flow.label} quote flow, {progressLabel}
        </p>

        <header className="mx-auto max-w-[680px] text-center">
          <h1 className="text-hero-5 font-bold md:text-hero-4">
            {hydratedTitle}
          </h1>
          {step.description ? (
            <p className="mt-4 text-lg text-fg md:text-xl">
              {step.description}
            </p>
          ) : null}
        </header>

        <div className="mt-10">
          {step.kind === "form" ? (
            <div className="space-y-8">
              {step.fields.map((field) => (
                <FieldRenderer
                  key={field.id}
                  field={field}
                  value={state[field.id]}
                  error={errors[field.id]}
                  onChange={(value) => updateValue(field.id, value)}
                />
              ))}
            </div>
          ) : null}

          {step.kind === "radio" || step.kind === "completion-choice" ? (
            <ChoiceGroup
              name={step.id}
              options={step.options}
              value={state[step.id]}
              error={errors[step.id]}
              variant={step.kind}
              onChange={(value) => updateValue(step.id, value)}
            />
          ) : null}

          {step.kind === "file-upload" ? (
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "grid min-h-[200px] w-full place-items-center rounded-card-sm border border-dashed border-grey-500 px-6 py-8 text-center transition-colors",
                  "hover:bg-bg-alt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                  errors[step.id] && "border-orderbase-red",
                )}
              >
                <span>
                  <Icon size={24} className="mx-auto">
                    <path d="M12 16V8" />
                    <path d="M8 12l4-4 4 4" />
                    <path d="M20 16.5A4.5 4.5 0 0 0 15.5 12h-.5A6 6 0 1 0 4 15.2" />
                  </Icon>
                  <span className="mt-5 block text-base font-medium">
                    {currentFileName ?? step.helperText}
                  </span>
                  <span className="mt-2 block text-sm text-fg-muted">
                    JPEG, PNG and PDF up to{" "}
                    {step.validation?.maxFileSizeMb ?? 50} MB.
                  </span>
                  <span className="mt-6 inline-flex h-9 items-center rounded-full border border-fg px-5 text-sm">
                    {step.uploadLabel}
                  </span>
                </span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                className="sr-only"
                accept={step.validation?.acceptedFileTypes?.join(",")}
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  setUploadedFile(file);
                  updateValue(
                    step.id,
                    file
                      ? {
                          name: file.name,
                          size: String(file.size),
                          type: file.type,
                        }
                      : null,
                  );
                }}
              />
              {errors[step.id] ? (
                <p className="mt-2 text-sm text-orderbase-red">
                  {errors[step.id]}
                </p>
              ) : null}
            </div>
          ) : null}

          {step.kind === "summary" ? (
            <p className="mx-auto max-w-[660px] text-center text-lg text-fg">
              {step.description}
            </p>
          ) : null}
        </div>

        <div className="mt-10 flex justify-end">
          <Button
            type="submit"
            size="lg"
            className={cn(
              "h-[68px] min-w-[200px] text-base",
              step.kind !== "summary" && "uppercase",
              step.kind === "summary" && "w-full",
            )}
          >
            {step.kind === "summary" ? step.submitLabel : (step.nextLabel ?? "Next")}
            <Icon size={22}>
              <path d="M5 12h14" />
              <path d="M13 6l6 6-6 6" />
            </Icon>
          </Button>
        </div>
      </form>
    </section>
  );
}

function FieldRenderer({
  field,
  value,
  error,
  onChange,
}: {
  field: QuoteField;
  value: QuoteFormValue | undefined;
  error?: string;
  onChange: (value: QuoteFormValue) => void;
}) {
  const label = (
    <span className="text-base font-medium">
      {field.label}{" "}
      {field.required ? <span className="text-accent">*</span> : null}
    </span>
  );

  if (field.type === "textarea") {
    const textValue = typeof value === "string" ? value : "";
    return (
      <div>
        <label className="block">
          {label}
          <Textarea
            value={textValue}
            onChange={(event) => onChange(event.target.value)}
            placeholder={field.placeholder}
            maxLength={field.validation?.maxLength}
            invalid={Boolean(error)}
            className="mt-2 min-h-[176px] rounded-[3px] border-grey-500"
          />
        </label>
        <div className="mt-2 flex items-center justify-between text-sm text-fg-muted">
          {error ? <p className="text-orderbase-red">{error}</p> : <span />}
          {field.validation?.maxLength ? (
            <span>
              {textValue.length} / {field.validation.maxLength}
            </span>
          ) : null}
        </div>
      </div>
    );
  }

  if (field.type === "radio" && field.options) {
    return (
      <div>
        <p>{label}</p>
        {field.helperText ? (
          <p className="mt-1 text-base text-fg-muted">{field.helperText}</p>
        ) : null}
        <ChoiceGroup
          name={field.id}
          options={field.options}
          value={value}
          error={error}
          variant="radio"
          compact
          onChange={onChange}
        />
      </div>
    );
  }

  if (field.type === "checkbox-group" && field.options) {
    const selectedValues = Array.isArray(value) ? value : [];
    return (
      <div>
        <p>{label}</p>
        {field.helperText ? (
          <p className="mt-1 text-base text-fg-muted">{field.helperText}</p>
        ) : null}
        <div className="mt-5 space-y-5">
          {field.options.map((option) => (
            <Checkbox
              key={option.value}
              id={`${field.id}-${option.value}`}
              label={option.label}
              checked={selectedValues.includes(option.value)}
              onChange={(event) => {
                const nextValues = event.target.checked
                  ? [...selectedValues, option.value]
                  : selectedValues.filter((item) => item !== option.value);
                onChange(nextValues);
              }}
            />
          ))}
        </div>
        {error ? (
          <p className="mt-2 text-sm text-orderbase-red">{error}</p>
        ) : null}
      </div>
    );
  }

  if (field.type === "select" && field.options) {
    return (
      <label className="block">
        {label}
        <select
          value={typeof value === "string" ? value : (field.defaultValue ?? "")}
          onChange={(event) => onChange(event.target.value)}
          className={cn(
            "mt-2 h-14 w-full rounded-[3px] border border-grey-500 bg-bg px-4 text-base text-fg focus:border-fg focus:outline-none",
            error && "border-orderbase-red",
          )}
        >
          {field.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error ? (
          <p className="mt-2 text-sm text-orderbase-red">{error}</p>
        ) : null}
      </label>
    );
  }

  return (
    <label className="block">
      {label}
      <Input
        type={field.type}
        value={typeof value === "string" ? value : ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder={field.placeholder}
        invalid={Boolean(error)}
        className="mt-2 h-11 rounded-[3px] border-grey-500 px-4"
      />
      {error ? <p className="mt-2 text-sm text-orderbase-red">{error}</p> : null}
    </label>
  );
}

function ChoiceGroup({
  name,
  options,
  value,
  error,
  variant,
  compact = false,
  onChange,
}: {
  name: QuoteFieldKey;
  options: readonly QuoteStepOption[];
  value: QuoteFormValue | undefined;
  error?: string;
  variant: "radio" | "completion-choice";
  compact?: boolean;
  onChange: (value: string) => void;
}) {
  const currentValue = typeof value === "string" ? value : "";
  const isCompletion = variant === "completion-choice";

  return (
    <div>
      <div
        className={cn(
          compact || options.length < 3
            ? "space-y-4"
            : "grid gap-4 md:grid-cols-2",
          isCompletion && "grid gap-4 md:grid-cols-2",
        )}
      >
        {options.map((option) => {
          const checked = currentValue === option.value;
          return (
            <label
              key={option.value}
              className={cn(
                "relative flex items-center gap-3 rounded-[3px] border border-grey-500 bg-bg px-4 text-base transition-colors",
                compact ? "min-h-11" : "min-h-[108px]",
                isCompletion && "min-h-[160px] justify-center text-center text-lg",
                checked && "border-fg bg-fg text-bg",
                "focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 focus-within:ring-offset-bg",
              )}
            >
              {option.recommended ? (
                <span className="absolute -top-5 left-3 rotate-[-8deg] rounded-full bg-accent px-3 py-1 text-sm font-bold text-accent-fg">
                  Recommended
                </span>
              ) : null}
              <Radio
                id={`${name}-${option.value}`}
                name={name}
                checked={checked}
                onChange={() => onChange(option.value)}
                className={cn(
                  checked &&
                    "border-accent bg-accent before:bg-fg group-data-none:block",
                )}
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
      {error ? <p className="mt-2 text-sm text-orderbase-red">{error}</p> : null}
    </div>
  );
}

function validateStep(
  step: QuoteStep,
  state: StoredLead,
  uploadedFile: File | null,
): ErrorMap {
  const errors: ErrorMap = {};

  if (step.kind === "form") {
    for (const field of step.fields) {
      const value = state[field.id];
      const rule = field.validation;

      if (field.required && isEmptyValue(value)) {
        errors[field.id] = "This field is required.";
        continue;
      }

      if (
        Array.isArray(value) &&
        rule?.minSelected &&
        value.length < rule.minSelected
      ) {
        errors[field.id] = `Choose at least ${rule.minSelected}.`;
      }

      if (
        Array.isArray(value) &&
        rule?.maxSelected &&
        value.length > rule.maxSelected
      ) {
        errors[field.id] = `Choose no more than ${rule.maxSelected}.`;
      }

      if (
        typeof value === "string" &&
        rule?.maxLength &&
        value.length > rule.maxLength
      ) {
        errors[field.id] = `Keep this under ${rule.maxLength} characters.`;
      }
    }
  }

  if (
    (step.kind === "radio" || step.kind === "completion-choice") &&
    step.validation?.required &&
    isEmptyValue(state[step.id])
  ) {
    errors[step.id] = "Please choose an option.";
  }

  if (step.kind === "file-upload" && uploadedFile) {
    const maxFileSizeMb = step.validation?.maxFileSizeMb;
    if (maxFileSizeMb && uploadedFile.size > maxFileSizeMb * 1024 * 1024) {
      errors[step.id] = `File must be ${maxFileSizeMb} MB or smaller.`;
    }
  }

  return errors;
}

function isEmptyValue(value: QuoteFormValue | undefined): boolean {
  if (value == null) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

function readStoredLead(): StoredLead {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as StoredLead;
  } catch {
    return {};
  }
}

function writeStoredLead(state: StoredLead) {
  if (typeof window === "undefined") return;
  // Merge with existing data to avoid overwriting unrelated fields (like firstName from picker)
  const existing = readStoredLead();
  const next = { ...existing, ...state };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
