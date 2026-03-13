export const parseChecked = (value: FormDataEntryValue | null) => value === "on";

export const parseNullableText = (value: FormDataEntryValue | null) => {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : null;
};

export const parseInteger = (value: FormDataEntryValue | null) => {
  const text = parseNullableText(value);
  if (!text) {
    return null;
  }

  const parsed = Number(text);
  if (!Number.isInteger(parsed)) {
    throw new Error(`Invalid integer value: ${text}`);
  }

  return parsed;
};
