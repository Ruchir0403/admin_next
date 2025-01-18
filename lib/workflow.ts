import { Client as WorkFlowClient } from "@upstash/workflow";
import config from "@/lib/config";
import { Client as QstashClient, resend } from "@upstash/qstash";

export const workflowClient = new WorkFlowClient({
  baseUrl: config.env.upstash.qstashUrl,
  token: config.env.upstash.qstashToken,
});

const qstashClient = new QstashClient({
  token: config.env.upstash.qstashToken,
});

export const sendEmail = async ({
  email,
  subject,
  message,
}: {
  email: string;
  subject: string;
  message: string;
}) => {
  await qstashClient.publishJSON({
    api: {
      name: "email",
      provider: resend({ token: config.env.resendToken }),
    },
    body: {
      from: "Acme <ruchirkumar.work.gd>",
      to: [email],
      subject,
      html: message,
    },
  });
};
