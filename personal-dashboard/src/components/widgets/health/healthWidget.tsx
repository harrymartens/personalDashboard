import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export default function HealthWidget() {
  // Daily Weight
  // Workouts this week
  // Sleep hours last

  return (
    <div className="flex size-full flex-col gap-4">
      <a className="text-med font-semibold">Health</a>
      <Drawer>
        <DrawerTrigger>
          <div className="flex flex-row items-center justify-around gap-4">
            <p>A</p>
            <p>B</p>
            <p>C</p>
          </div>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Are you absolutely sure?</DrawerTitle>
            <DrawerDescription>This action cannot be undone.</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
