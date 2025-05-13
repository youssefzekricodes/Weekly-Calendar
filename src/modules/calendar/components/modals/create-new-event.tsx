import {
  Form as AntForm,
  Button,
  Checkbox,
  DatePicker,
  Drawer,
  Input,
  Select,
} from "antd";
import dayjs from "dayjs";
import { Controller, useForm, useWatch } from "react-hook-form";

import { useEventsStore } from "../../store";
import {
  EventCategories,
  Recurrence,
  RecurrenceDays,
  type CalendarEvent,
} from "../../types";

const { Option } = Select;
const { RangePicker } = DatePicker;

type CalendarEventFormInput = Omit<CalendarEvent, "id" | "start" | "end"> & {
  datetime: [dayjs.Dayjs, dayjs.Dayjs];
};

const weekdayOptions = Object.values(RecurrenceDays);

const CreateEventModal = ({
  visible = true,
  onClose,
}: {
  visible?: boolean;
  onClose?: () => void;
}) => {
  const { addEvent } = useEventsStore();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CalendarEventFormInput>({
    defaultValues: {
      recurrence: Recurrence.NONE,
      category: EventCategories.WORK,
    },
  });
  const selectedRecurrence = useWatch({ control, name: "recurrence" });

  const onSubmit = (data: CalendarEvent) => {
    addEvent(data);
  };
  const submitHandler = (data: CalendarEventFormInput) => {
    const [start, end] = data.datetime;
    const payload: CalendarEvent = {
      id: crypto.randomUUID(),
      title: data.title,
      start: start.toDate(),
      end: end.toDate(),
      recurrence: data.recurrence,
      recurrenceDays:
        data.recurrence === "weekly" ? data.recurrenceDays ?? [] : undefined,
      category: data.category,
    };
    onSubmit?.(payload);
    onClose?.();
  };
  const handelClose = () => {
    reset(undefined, { keepErrors: false });
    onClose?.();
  };

  return (
    <Drawer
      open={visible}
      title="Create Event"
      onClose={handelClose}
      footer={null}
    >
      <form onSubmit={handleSubmit(submitHandler)} noValidate>
        <Controller
          control={control}
          name="title"
          rules={{ required: "Title is required" }}
          render={({ field }) => <Input {...field} placeholder="title" />}
        />

        <AntForm.Item
          label="Time Range"
          validateStatus={errors.datetime ? "error" : ""}
          help={
            errors.datetime?.message ||
            (errors.datetime && "Start and end time are required")
          }
        >
          <Controller
            control={control}
            name="datetime"
            rules={{
              required: "Start and end time are required",
              validate: (value) => {
                if (!value || value.length !== 2)
                  return "Please select a time range";
                const [start, end] = value;
                if (!start || !end)
                  return "Both start and end times are required";
                if (!start.isSame(end, "day"))
                  return "Start and end must be on the same day";
                if (!start.isBefore(end))
                  return "Start time must be before end time";
                return true;
              },
            }}
            render={({ field }) => (
              <RangePicker
                showTime
                format="YYYY-MM-DD HH"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </AntForm.Item>

        <AntForm.Item label="Category">
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <Select {...field}>
                {Object.values(EventCategories).map((value) => (
                  <Option key={value} value={value}>
                    {value[0].toUpperCase() + value.slice(1)}
                  </Option>
                ))}
              </Select>
            )}
          />
        </AntForm.Item>

        <AntForm.Item label="Recurrence">
          <Controller
            control={control}
            name="recurrence"
            render={({ field }) => (
              <Select {...field}>
                {Object.values(Recurrence).map((value) => (
                  <Option key={value} value={value}>
                    {value[0].toUpperCase() + value.slice(1)}
                  </Option>
                ))}
              </Select>
            )}
          />
        </AntForm.Item>

        {selectedRecurrence === "weekly" && (
          <AntForm.Item
            label="Repeat On"
            validateStatus={errors.recurrenceDays ? "error" : ""}
            help={errors.recurrenceDays?.message}
          >
            <Controller
              control={control}
              name="recurrenceDays"
              rules={{
                validate: (value) => {
                  if (
                    selectedRecurrence === "weekly" &&
                    (!value || value.length === 0)
                  )
                    return "Please select at least one day";
                  return true;
                },
              }}
              render={({ field }) => (
                <Checkbox.Group
                  options={weekdayOptions}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </AntForm.Item>
        )}

        <div className="flex justify-end mt-4 gap-2">
          <Button onClick={handelClose}>Cancel</Button>
          <Button type="primary" htmlType="submit">
            Create
          </Button>
        </div>
      </form>
    </Drawer>
  );
};

export default CreateEventModal;
