import { useState } from "react";
import { useTheme } from "next-themes";
import { CloudSun, Monitor, Moon } from "pixelarticons/react";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/features/shared/components/ui";
import { buttonVariants } from "@/features/shared/components/ui/button-variants";
import { cn } from "@/features/shared/lib/utils";

export function ThemeToggle() {
  const { setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label="Toggle theme"
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "relative",
        )}
      >
        <CloudSun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </PopoverTrigger>
      <PopoverContent
        side="left"
        align="start"
        className="w-36 p-1 flex flex-col gap-0"
      >
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2"
          onClick={() => {
            setTheme("light");
            setOpen(false);
          }}
        >
          <CloudSun className="h-4 w-4" />
          Light
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2"
          onClick={() => {
            setTheme("dark");
            setOpen(false);
          }}
        >
          <Moon className="h-4 w-4" />
          Dark
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2"
          onClick={() => {
            setTheme("system");
            setOpen(false);
          }}
        >
          <Monitor className="h-4 w-4" />
          System
        </Button>
      </PopoverContent>
    </Popover>
  );
}
