import {
  Schema,
  model,
  models,
} from "mongoose";

const eventMeetingSchema =
  new Schema(
    {
      title: {
        type: String,
        required: true,
      },

      description: {
        type: String,
        required: true,
      },

      meetingLink: {
        type: String,
        required: true,
      },

      date: {
        type: String,
        required: true,
      },

      time: {
        type: String,
        required: true,
      },

      assign: [
        {
          type: String,
        },
      ],

      branchName: {
        type: String,
        required: true,
      },

      createdBy: {
        type: String,
      },
    },
    {
      timestamps: true,
    }
  );

const EventMeeting =
  models.EventMeeting ||
  model(
    "EventMeeting",
    eventMeetingSchema
  );

export default EventMeeting;