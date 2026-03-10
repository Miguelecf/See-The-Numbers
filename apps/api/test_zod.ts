import { z } from "zod";

const quantity = z.preprocess((val) => {
  if (typeof val === 'string') {
    const parsed = parseFloat(val.replace(',', '.'));
    console.log(`Parsed '${val}' to`, parsed);
    return parsed;
  }
  return val;
}, z.coerce.number().min(0).default(0));

try {
  console.log("Empty string:", quantity.parse(""));
} catch (e: any) {
  console.log("Empty string error:", e.errors);
}

try {
  console.log("undefined:", quantity.parse(undefined));
} catch (e: any) {
  console.log("undefined error:", e.errors);
}
