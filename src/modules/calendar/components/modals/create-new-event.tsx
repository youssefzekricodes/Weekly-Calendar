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
import CloseIcon from "../../../../assets/icons/ic-close";
import clsx from "clsx";
import ClockIcon from "../../../../assets/icons/ic-clock";

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
    setValue,
    setError,
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
      setError("end", {
        type: "manual",
        message: "End time must be after start time",
      });
      return;
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
      title={
        <p className="create-event-drawer__title">
          {isEditing ? "Edit event" : "Create new event"}
        </p>
      }
      onClose={handleClose}
      footer={null}
      closeIcon={<CloseIcon />}
      className="create-event-drawer"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <AntForm.Item
          label="Title"
          layout="vertical"
          validateStatus={errors.title ? "error" : ""}
          help={errors.title?.message}
        >
          <Controller
            control={control}
            name="title"
            rules={{ required: "Title is required" }}
            render={({ field }) => (
              <Input {...field} placeholder="Event title" size="large" />
            )}
          />
        </AntForm.Item>

        <div style={{ display: "flex", gap: "1rem" }}>
          <AntForm.Item
            label="Start Time"
            layout="vertical"
            validateStatus={errors.start ? "error" : ""}
            help={errors.start?.message}
            style={{ flex: 1 }}
          >
            <Controller
              control={control}
              name="start"
              rules={{ required: "Start time is required" }}
              render={({ field }) => (
                <TimePicker
                  {...field}
                  format="HH"
                  value={dayjs(field.value)}
                  style={{ width: "100%" }}
                  showNow={false}
                  allowClear={false}
                  size="large"
                  suffixIcon={<ClockIcon />}
                />
              )}
            />
          </AntForm.Item>

          <AntForm.Item
            label="End Time"
            layout="vertical"
            validateStatus={errors.end ? "error" : ""}
            help={errors.end?.message}
            style={{ flex: 1 }}
          >
            <Controller
              control={control}
              name="end"
              rules={{ required: "End time is required" }}
              render={({ field }) => (
                <TimePicker
                  {...field}
                  format="HH"
                  value={dayjs(field.value)}
                  style={{ width: "100%" }}
                  showNow={false}
                  allowClear={false}
                  size="large"
                  suffixIcon={<ClockIcon />}
                />
              )}
            />
          </AntForm.Item>
        </div>

        <AntForm.Item label="Category" layout="vertical">
          <Controller
            control={control}
            name="category"
            render={({ field }) => {
              console.log({ field });
              return (
                <div className="create-event-drawer__categories">
                  {Object.values(EventCategories).map((val) => (
                    <div
                      key={val}
                      className={clsx(
                        `create-event-drawer__category create-event-drawer__category--${val}`,
                        {
                          [`create-event-drawer__category--${val}--active`]:
                            field.value === val,
                        }
                      )}
                      onClick={() => setValue("category", val)}
                    >
                      {val[0].toUpperCase() + val.slice(1)}
                    </div>
                  ))}
                </div>
              );
            }}
          />
        </AntForm.Item>

        <AntForm.Item label="Recurrence" layout="vertical">
          <Controller
            control={control}
            name="recurrence"
            render={({ field }) => (
              <Select {...field} value={field.value} size="large">
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
            layout="vertical"
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
              render={({ field }: any) => (
                <div className="create-event-drawer__week-days">
                  {weekdayOptions.map((day) => (
                    <div
                      className={clsx(
                        "create-event-drawer__week-days__option",
                        {
                          "create-event-drawer__week-days__option--active":
                            field.value?.includes(day),
                        }
                      )}
                      onClick={() => {
                        const newDays = field.value?.includes(day)
                          ? field.value.filter((d: string) => d !== day)
                          : [...(field.value || []), day];
                        setValue("recurrenceDays", newDays, {
                          shouldValidate: true,
                        });
                      }}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              )}
            />
          </AntForm.Item>
        )}

        <div className="create-event-drawer__footer">
          <Button
            onClick={handleClose}
            className="create-event-drawer__button create-event-drawer__cancel"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            onClick={() => {
              actionRef.current = "update-all";
            }}
            className="create-event-drawer__button create-event-drawer__submit"
          >
            {isEditing ? `Update ${isRecurring ? "all" : ""}` : "Create Event"}
          </Button>
          {isEditing && isRecurring && (
            <Button
              type="default"
              htmlType="submit"
              onClick={() => {
                actionRef.current = "update-one";
              }}
              className="create-event-drawer__button create-event-drawer__update"
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
