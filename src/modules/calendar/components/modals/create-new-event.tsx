// CreateEventModal.tsx
import {
  Form as AntForm,
  Button,
  Checkbox,
  Drawer,
  Input,
  Select,
  TimePicker,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useRef } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useEventsStore } from "../../store";
import {
  EventCategories,
  Recurrence,
  RecurrenceDays,
  type CalendarEvent,
} from "../../types";

const { Option } = Select;
const weekdayOptions = Object.values(RecurrenceDays);

type CalendarEventFormInput = Omit<CalendarEvent, "id">;

interface ICreateEventModalProps {
  visible?: boolean;
  onClose?: () => void;
  selectedCell: Partial<CalendarEvent> | null;
}

const CreateEventModal = ({
  visible = true,
  onClose,
  selectedCell,
}: ICreateEventModalProps) => {
  const actionRef = useRef<"update-one" | "update-all">("update-all");
  const { addEvent, updateEvent, excludeDateFromRecurrence } = useEventsStore();

  const isEditing = !!selectedCell?.id;
  const isRecurring = [Recurrence.DAILY, Recurrence.WEEKLY].includes(
    selectedCell?.recurrence!
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CalendarEventFormInput>({
    defaultValues: {
      title: "",
      start: dayjs(selectedCell?.start),
      end: dayjs(selectedCell?.start).add(1, "hour"),
      recurrence: Recurrence.NONE,
      category: EventCategories.WORK,
    },
  });

  const recurrence = useWatch({ control, name: "recurrence" });

  useEffect(() => {
    if (selectedCell?.start) {
      reset({
        title: selectedCell.title ?? "",
        start: dayjs(selectedCell.start),
        end:
          dayjs(selectedCell.end) ?? dayjs(selectedCell.start).add(1, "hour"),
        recurrence: selectedCell.recurrence ?? Recurrence.NONE,
        recurrenceDays: selectedCell.recurrenceDays ?? [],
        category: selectedCell.category ?? EventCategories.WORK,
      });
    }
  }, [selectedCell]);

  const handleClose = () => {
    reset();
    onClose?.();
  };

  const handleFormSubmit = (data: CalendarEventFormInput) => {
    const { start, end, ...rest } = data;

    const startTime = dayjs(selectedCell?.start)
      .hour(dayjs(start).hour())
      .minute(0)
      .second(0);

    let endTime = dayjs(selectedCell?.start)
      .hour(dayjs(end).hour())
      .minute(0)
      .second(0);

    if (!endTime.isAfter(startTime)) {
      endTime = startTime.add(1, "hour");
    }

    const payload: CalendarEvent = {
      ...rest,
      id: selectedCell?.id ?? crypto.randomUUID(),
      start: dayjs(startTime.toDate()),
      end: dayjs(endTime.toDate()),
      recurrenceDays:
        rest.recurrence === Recurrence.WEEKLY
          ? rest.recurrenceDays ?? []
          : undefined,
    };

    if (isEditing) {
      if (actionRef.current === "update-one") {
        excludeDateFromRecurrence(startTime, selectedCell!.id!);
        addEvent({
          ...payload,
          id: crypto.randomUUID(),
          recurrence: Recurrence.NONE,
        });
      } else {
        updateEvent(payload);
      }
    } else {
      addEvent(payload);
    }

    handleClose();
  };

  return (
    <Drawer
      open={visible}
      title={`${isEditing ? "Edit" : "Create"} Event`}
      onClose={handleClose}
      footer={null}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <AntForm.Item label="Title">
          <Controller
            control={control}
            name="title"
            rules={{ required: "Title is required" }}
            render={({ field }) => (
              <Input {...field} placeholder="Event title" />
            )}
          />
        </AntForm.Item>

        <AntForm.Item label="Start Time">
          <Controller
            control={control}
            name="start"
            render={({ field }) => (
              <TimePicker {...field} format="HH" value={dayjs(field.value)} />
            )}
          />
        </AntForm.Item>

        <AntForm.Item label="End Time">
          <Controller
            control={control}
            name="end"
            render={({ field }) => (
              <TimePicker {...field} format="HH" value={dayjs(field.value)} />
            )}
          />
        </AntForm.Item>

        <AntForm.Item label="Category">
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <Select {...field} value={field.value}>
                {Object.values(EventCategories).map((val) => (
                  <Option key={val} value={val}>
                    {val[0].toUpperCase() + val.slice(1)}
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
              <Select {...field} value={field.value}>
                {Object.values(Recurrence).map((val) => (
                  <Option key={val} value={val}>
                    {val[0].toUpperCase() + val.slice(1)}
                  </Option>
                ))}
              </Select>
            )}
          />
        </AntForm.Item>

        {recurrence === Recurrence.WEEKLY && (
          <AntForm.Item
            label="Repeat On"
            validateStatus={errors.recurrenceDays ? "error" : ""}
            help={errors.recurrenceDays?.message}
          >
            <Controller
              control={control}
              name="recurrenceDays"
              rules={{
                validate: (value) =>
                  recurrence === Recurrence.WEEKLY &&
                  (!value || value.length === 0)
                    ? "Please select at least one day"
                    : true,
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

        {isRecurring && (
          <p className="text-sm text-gray-500">
            This is a recurring event every{" "}
            {selectedCell?.recurrence?.toLowerCase()}.
          </p>
        )}

        <div className="flex justify-end mt-4 gap-2">
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="primary"
            htmlType="submit"
            onClick={() => {
              actionRef.current = "update-all";
            }}
          >
            {isEditing ? "Update All" : "Create Event"}
          </Button>
          {isEditing && isRecurring && (
            <Button
              type="default"
              htmlType="submit"
              onClick={() => {
                actionRef.current = "update-one";
              }}
            >
              Update This Only
            </Button>
          )}
        </div>
      </form>
    </Drawer>
  );
};

export default CreateEventModal;
