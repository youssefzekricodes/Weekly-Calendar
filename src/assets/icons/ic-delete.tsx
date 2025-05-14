import React, { type SVGProps } from "react";

const DeleteIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M6.11377 2.66683C6.38833 1.89003 7.12915 1.3335 7.99997 1.3335C8.87078 1.3335 9.6116 1.89003 9.88616 2.66683"
        stroke="#FF4141"
        stroke-width="1.375"
        stroke-linecap="round"
      />
      <path
        d="M13.6669 4H2.3335"
        stroke="#FF4141"
        stroke-width="1.375"
        stroke-linecap="round"
      />
      <path
        d="M12.5554 5.6665L12.2488 10.2659C12.1308 12.0359 12.0718 12.9208 11.4952 13.4603C10.9185 13.9998 10.0315 13.9998 8.25768 13.9998H7.7421C5.96824 13.9998 5.0813 13.9998 4.50463 13.4603C3.92796 12.9208 3.86896 12.0359 3.75096 10.2659L3.44434 5.6665"
        stroke="#FF4141"
        stroke-width="1.375"
        stroke-linecap="round"
      />
      <path
        d="M6.3335 7.3335L6.66683 10.6668"
        stroke="#FF4141"
        stroke-width="1.375"
        stroke-linecap="round"
      />
      <path
        d="M9.66683 7.3335L9.3335 10.6668"
        stroke="#FF4141"
        stroke-width="1.375"
        stroke-linecap="round"
      />
    </svg>
  );
};

export default DeleteIcon;
