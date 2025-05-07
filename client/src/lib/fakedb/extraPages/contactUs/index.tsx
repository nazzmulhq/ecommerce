export type ContactUsData = {
  sendMessage: SendMessageData;
};

export type SendMessageData = {
  description: string;
};

export const contactUsData: ContactUsData = {
  sendMessage: {
    description:
      "The clean and well commented code allows easy customization of the theme. It's designed for describing your app, agency or business.",
  },
};
