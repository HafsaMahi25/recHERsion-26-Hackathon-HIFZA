import { describe, expect, it } from "vitest";
import { analyzeMessage, demoScenarios, validateMessage } from "@/lib/analyzer";

describe("analyzer", () => {
  it("rejects empty and too-short input", () => {
    expect(validateMessage("   ")).not.toBeNull();
    expect(validateMessage("hi")).not.toBeNull();
    expect(validateMessage("This is long enough")).toBeNull();
  });
  it("flags several signals in the sextortion scenario", () => {
    expect(analyzeMessage(demoScenarios[1]!.text).level).toBe("several");
  });
  it("never claims an ordinary message is safe", () => {
    const r = analyzeMessage(demoScenarios[4]!.text);
    expect(r.level).toBe("few");
    expect(r.nextSteps.join(" ")).toContain("does not mean the message is safe");
  });
});
