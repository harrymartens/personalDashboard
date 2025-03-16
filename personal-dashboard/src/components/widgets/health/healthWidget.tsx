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
import SleepGraph from "./sleepGraph";
import WeightGraph from "./weightGraph";



export default function HealthWidget() {
  

  return (
    <div className="flex size-full flex-col gap-4">
      <a className="text-med font-semibold">Health</a>

      <Drawer>
        <DrawerTrigger>
          <div className="flex size-full flex-row items-center justify-around gap-4">
            <WeightGraph />
            <SleepGraph />

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
