import React from 'react';
import {Button, ButtonProps} from "@mantine/core";
import VkontakteIcon from "./VkontakteIcon";

const VkontakteButton = (props: ButtonProps) => {
    return (
        <Button component="a" leftIcon={<VkontakteIcon />} variant="default" color="gray"  {...props} />
    );
};

export default VkontakteButton;
