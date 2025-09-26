import React, { SetStateAction } from "react";
import { Modal, Box } from "@mui/material";

type RequiredProps = {
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  setRoute: React.Dispatch<SetStateAction<string>>;
};

type CustomProps<T = {}> = {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  activeItem: any;
  setRoute: React.Dispatch<SetStateAction<string>>;
  component: React.ComponentType<RequiredProps & T>;
} & T;

function CustomModel<T = {}>({
  open,
  setOpen,
  setRoute,
  activeItem,
  component: Component,
  ...rest
}: CustomProps<T>) {
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white rounded-[8px]">
        <Component setOpen={setOpen} setRoute={setRoute} {...(rest as T)} />
      </Box>
    </Modal>
  );
}

export default CustomModel;
