"use client";

import {  getPriority, getStatus, getTypes } from "@/api";
import { Button } from "@/components/ui/button";
import {
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { CalendarIcon, ChevronDown, Repeat } from "lucide-react";

import { useEffect, useState } from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";


export const formSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, { message: "Task must have a title." }),
  type: z.string(),
  created_at: z.string(),
  status: z.string(),
  complete: z.boolean(),
  completed_date: z.string().nullable(),
  priority: z.string(),
  scheduled_date: z.string().nullable(),
  course: z.string().nullable(),
  due_date: z.string().nullable(),
  reoccurring: z.boolean(),
  reoccurring_interval: z.coerce.number(),
  week: z.coerce.number({ message: "Week must be a number." }).nullable(),
  weight: z.coerce.number({ message: "Weight must be a number." }).nullable(),
})
  .superRefine((values, ctx) => {
    if (values.reoccurring && values.reoccurring_interval <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please enter a valid interval if reoccurring is checked.",
        path: ["reoccurring_interval"], // Associate the error with the reoccurring_interval field
      });
    }
    if (values.reoccurring && values.scheduled_date == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select a scheduled date for reoccurring tasks.",
        path: ["scheduled_date"], // Associate the error with the reoccurring_interval field
      });
    }
  });

  type TaskFormProps = {
    initialValues: z.infer<typeof formSchema>;
    onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>;
    submitButtonLabel: string;
  };


  export default function TaskForm({ initialValues, onSubmit, submitButtonLabel }: TaskFormProps) {
  // const [open, setOpen] = useState(false);
  const [data, setData] = useState<{ name: string }[] | null>(null);
  const [statusList, setStatus] = useState<{ name: string }[] | null>(null);
  const [priorityList, setPriority] = useState<{ name: string }[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const types = await getTypes();
        setData(types);
      } catch (err) {
        console.error("Error fetching types:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const status = await getStatus();
        setStatus(status);
      } catch (err) {
        console.error("Error fetching types:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const priority = await getPriority();
        setPriority(priority);
      } catch (err) {
        console.error("Error fetching types:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <ScrollArea className="max-h-[400px] overflow-y-auto">
                <div className="flex flex-col gap-4 p-4">
                  <div className="flex flex-row gap-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem className="flex w-80 flex-col gap-2">
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Take out the trash"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="reoccurring"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-4">
                          <FormLabel>
                            <Repeat className="size-4" />
                          </FormLabel>
                          <FormControl >
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            ></Checkbox>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {form.watch("reoccurring") === true && (
                      <>
                        <FormField
                          control={form.control}
                          name="reoccurring_interval"
                          render={({ field }) => (
                            <FormItem className="flex flex-col gap-2">
                              <FormLabel>Interval</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="1"
                                  {...field}
                                  value={field.value === 0 ? "" : field.value}
                                  className="w-10"
                                />
                              </FormControl>
                              <FormMessage className="text-red" />
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                  </div>

                  <div className="flex flex-row justify-between">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem className="flex w-48 flex-col gap-2">
                          <FormLabel>Type</FormLabel>
                          <FormControl>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild className="">
                                <Button variant="secondary">
                                  {field.value} <ChevronDown />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuLabel>
                                  Select Task Type
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {loading ? (
                                  <DropdownMenuItem disabled>
                                    Loading...
                                  </DropdownMenuItem>
                                ) : data && data.length > 0 ? (
                                  data.map((item) => (
                                    <DropdownMenuItem
                                      key={item.name}
                                      onClick={() => field.onChange(item.name)}
                                    >
                                      {item.name}
                                    </DropdownMenuItem>
                                  ))
                                ) : (
                                  <DropdownMenuItem disabled>
                                    No types available
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem className="flex w-48 flex-col gap-2">
                          <FormLabel>Status</FormLabel>
                          <FormControl>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild className="">
                                <Button variant="secondary">
                                  {field.value} <ChevronDown />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuLabel>
                                  Select Task Status
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {loading ? (
                                  <DropdownMenuItem disabled>
                                    Loading...
                                  </DropdownMenuItem>
                                ) : statusList && statusList.length > 0 ? (
                                  statusList.map((item) => (
                                    <DropdownMenuItem
                                      key={item.name}
                                      onClick={() => field.onChange(item.name)}
                                    >
                                      {item.name}
                                    </DropdownMenuItem>
                                  ))
                                ) : (
                                  <DropdownMenuItem disabled>
                                    No status available
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <hr className="bg-dark" />

                  <div className="flex flex-row justify-between">
                    <FormField
                      control={form.control}
                      name="scheduled_date"
                      render={({ field }) => {
                        const selectedDate = field.value
                          ? parseISO(field.value)
                          : undefined;

                        return (
                          <FormItem className="flex flex-col gap-2">
                            <FormLabel>Scheduled Date</FormLabel>
                            <FormControl>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-48 justify-start text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    <CalendarIcon className="mr-2" />
                                    {field.value ? (
                                      format(selectedDate!, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <Calendar
                                    className="pointer-events-auto"
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={(date) => {
                                      field.onChange(
                                        date ? date.toISOString() : null
                                      );
                                    }}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </FormControl>
                          </FormItem>
                        );
                      }}
                    />

                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem className="flex w-48 flex-col gap-2">
                          <FormLabel>Priority</FormLabel>
                          <FormControl>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild className="">
                                <Button variant="secondary">
                                  {field.value} <ChevronDown />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuLabel>
                                  Select Task Priority
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {loading ? (
                                  <DropdownMenuItem disabled>
                                    Loading...
                                  </DropdownMenuItem>
                                ) : priorityList && priorityList.length > 0 ? (
                                  priorityList.map((item) => (
                                    <DropdownMenuItem
                                      key={item.name}
                                      onClick={() => field.onChange(item.name)}
                                    >
                                      {item.name}
                                    </DropdownMenuItem>
                                  ))
                                ) : (
                                  <DropdownMenuItem disabled>
                                    No Priorities available
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  {form.watch("type") === "University" && (
                    <>
                      <hr className="bg-dark" />

                      <div className="flex flex-row justify-between">
                        <FormField
                          control={form.control}
                          name="course"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Course</FormLabel>
                              <FormControl>
                                <Input
                                  className="w-48"
                                  placeholder="COMP1234"
                                  {...field}
                                  value={field.value ?? ""}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="week"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Week</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="7"
                                  {...field}
                                  value={field.value ?? ""}
                                />
                              </FormControl>
                              <FormMessage className="text-red" />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex flex-row justify-between">
                        <FormField
                          control={form.control}
                          name="due_date"
                          render={({ field }) => {
                            const selectedDate = field.value
                              ? parseISO(field.value)
                              : undefined;

                            return (
                              <FormItem className="flex flex-col gap-2">
                                <FormLabel>Due Date</FormLabel>
                                <FormControl>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant={"outline"}
                                        className={cn(
                                          "w-48 justify-start text-left font-normal",
                                          !field.value &&
                                            "text-muted-foreground"
                                        )}
                                      >
                                        <CalendarIcon className="mr-2" />
                                        {field.value ? (
                                          format(selectedDate!, "PPP")
                                        ) : (
                                          <span>Pick a date</span>
                                        )}
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                      className="w-auto p-0"
                                      align="start"
                                    >
                                      <Calendar
                                        className="pointer-events-auto"
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={(date) => {
                                          field.onChange(
                                            date ? date.toISOString() : null
                                          );
                                        }}
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                </FormControl>
                              </FormItem>
                            );
                          }}
                        />

                        <FormField
                          control={form.control}
                          name="weight"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Weight</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    placeholder="20"
                                    // Show only the numeric portion in the input
                                    {...field}
                                    value={field.value ?? ""}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage className="text-red" />
                            </FormItem>
                          )}
                        />
                      </div>
                    </>
                  )}
                </div>
              </ScrollArea>

              <div className="pt-4">
                <DialogTrigger asChild>
                  <Button type="submit" disabled={!form.formState.isValid} onClick={() => {
                    toast("Task has been created", {
                      description: form.getValues("title"),
                    });


                  }}>
                    {submitButtonLabel}
                  </Button>
                </DialogTrigger>
              </div>
            </form>
          </Form>
    </div>
  );
}
