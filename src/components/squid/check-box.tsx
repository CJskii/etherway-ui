import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Input } from "../ui/input";
import React from "react";

export function CheckBoxComponent({
  isChecked,
  setIsChecked,
  setToAddress,
}: {
  isChecked: boolean;
  setIsChecked: (value: boolean) => void;
  setToAddress: (value: string) => void;
}) {
  return (
    <div className="flex flex-col justify-center items-start gap-2">
      <CheckBox isChecked={isChecked} setIsChecked={setIsChecked} />
      {isChecked && (
        <Input
          type="text"
          placeholder="Enter address"
          onChange={(e) => setToAddress(e.target.value)}
          className="p-2 text-sm rounded-xl dark:bg-white dark:text-black "
        />
      )}
    </div>
  );
}

export function CheckBox({
  isChecked,
  setIsChecked,
}: {
  isChecked: boolean;
  setIsChecked: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="another-address" className="text-sm dark:text-black">
        Send to another address
      </Label>
      <Switch id="another-address" onClick={() => setIsChecked(!isChecked)} />
    </div>
  );
}
