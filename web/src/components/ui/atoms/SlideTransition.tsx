import { forwardRef } from "react";
import { Slide } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";

export const SlideTransition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<unknown>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});