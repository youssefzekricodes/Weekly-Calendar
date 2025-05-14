import { Button, Modal } from "antd";
import dayjs from "dayjs";
import { useEventsStore } from "../../store";
import CloseIcon from "../../../../assets/icons/ic-close";
import DeleteIllustrate from "../../../../assets/icons/ic-delete-ilustrate";

interface IConfirmDeleteProps {
  open: boolean;
  onCancel: () => void;
  id: string;
  date?: dayjs.Dayjs;
  isRecurrence?: boolean;
}
const ConfirmDelete = ({
  open,
  onCancel,
  id,
  date,
  isRecurrence,
}: IConfirmDeleteProps) => {
  const { excludeDateFromRecurrence, removeEvent } = useEventsStore();
  const handelDeleteSeries = () => {
    removeEvent(id);
    onCancel();
  };

  const handelDeleteOne = () => {
    if (isRecurrence) excludeDateFromRecurrence(dayjs(date), id);
    else removeEvent(id);
    onCancel();
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      closeIcon={<CloseIcon />}
      title={<p className="create-event-drawer__title">Delete</p>}
    >
      <div className="confirm-delete">
        <DeleteIllustrate />
        <h2 className="confirm-delete__title">
          Are you sure you want to delete this event?
        </h2>
        <p className="confirm-delete__subtitle">
          If you click on delete all, all the events in this series will be
          deleted.
        </p>
        <div className="create-event-drawer__footer confirm-delete__footer ">
          <Button
            onClick={onCancel}
            className="create-event-drawer__button create-event-drawer__cancel"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handelDeleteOne}
            className="create-event-drawer__button confirm-delete__delete-one"
          >
            {`Delete One`}
          </Button>
          {isRecurrence && (
            <Button
              type="primary"
              onClick={handelDeleteSeries}
              className="create-event-drawer__button confirm-delete__delete-all"
            >
              {`Delete all `}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDelete;
