import { Modal } from "antd";
import dayjs from "dayjs";
import { useEventsStore } from "../../store";

interface IConfirmDeleteProps {
  open: boolean;
  onCancel: () => void;
  id: string;
  date?: dayjs.Dayjs;
  isRecurring?: boolean;
}
const ConfirmDelete = ({
  open,
  onCancel,
  id,
  date,
  isRecurring,
}: IConfirmDeleteProps) => {
  const { excludeDateFromRecurrence, removeEvent } = useEventsStore();
  const handelDeleteSeries = () => {
    removeEvent(id);
    onCancel();
  };

  const handelDeleteOne = () => {
    if (isRecurring) excludeDateFromRecurrence(dayjs(date), id);
    else removeEvent(id);
    onCancel();
  };

  return (
    <Modal open={open} onClose={onCancel} footer={null}>
      <div className="confirm-delete">
        <h2>Are you sure you want to delete this event?</h2>
        <div className="confirm-delete__actions">
          <button className="confirm-delete__button confirm-delete__button--cancel">
            Cancel
          </button>
          {isRecurring && (
            <div className="confirm-delete__recurrence">
              <p>This event is part of a recurring series.</p>
              <p>Do you want to delete this event only or the entire series?</p>
              <button
                className="confirm-delete__button confirm-delete__button--delete"
                onClick={handelDeleteSeries}
              >
                Delete All
              </button>
            </div>
          )}
          <button
            className="confirm-delete__button confirm-delete__button--delete"
            onClick={handelDeleteOne}
          >
            Delete This Event
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDelete;
