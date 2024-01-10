import * as React from "react";
import SvgIcon from "@mui/material/SvgIcon";

export function XIcon(props) {
  return (
    <SvgIcon {...props}>
      {/* credit: plus icon from https://heroicons.com/ */}
      <svg
        width="38"
        height="38"
        viewBox="0 0 38 38"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.6855 2.09824C9.12344 0.53614 6.59073 0.53614 5.02866 2.09824L2.06284 5.06408C0.500702 6.62618 0.500702 9.15884 2.06284 10.7209L10.6463 19.3044L2.0629 27.8877C0.500763 29.4498 0.500763 31.9825 2.0629 33.5446L5.02872 36.5104C6.59085 38.0725 9.1235 38.0725 10.6856 36.5104L19.269 27.9271L27.8523 36.5104C29.4144 38.0725 31.9471 38.0725 33.5092 36.5104L36.475 33.5446C38.0371 31.9825 38.0371 29.4498 36.475 27.8877L27.8916 19.3044L36.4751 10.7209C38.0371 9.15884 38.0371 6.62618 36.4751 5.06408L33.5092 2.09824C31.9471 0.53614 29.4145 0.536156 27.8524 2.09824L19.269 10.6817L10.6855 2.09824Z"
          fill="currentColor"
        />
      </svg>
    </SvgIcon>
  );
}

export function CircleIcon(props) {
  return (
    <SvgIcon {...props}>
      {/* credit: plus icon from https://heroicons.com/ */}
      <svg
        width="39"
        height="39"
        viewBox="0 0 39 39"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M19.5 39C30.2696 39 39 30.2696 39 19.5C39 8.73045 30.2696 0 19.5 0C8.73045 0 0 8.73045 0 19.5C0 30.2696 8.73045 39 19.5 39ZM19.5 27C23.6421 27 27 23.6421 27 19.5C27 15.3579 23.6421 12 19.5 12C15.3579 12 12 15.3579 12 19.5C12 23.6421 15.3579 27 19.5 27Z"
          fill="currentColor"
        />
      </svg>
    </SvgIcon>
  );
}
