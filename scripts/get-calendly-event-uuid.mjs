const USER_EMAIL = "josh@zuplo.com";
const EVENT_URL = "https://calendly.com/d/3px-m7m-7ym/call-with-api-experts";

const init = {
  headers: {
    Authorization: `Bearer ${process.env.CALENDLY_API_KEY}`,
  },
};
const members = await fetch(
  "https://api.calendly.com/organization_memberships?organization=https://api.calendly.com/organizations/EDHBV6XVYEON7GCR",
  init,
).then((response) => response.json());

const member = members.collection.find(
  (member) => member.user.email === USER_EMAIL,
);

const events = await fetch(
  `https://api.calendly.com/event_types?user=${member.user.uri}`,
  init,
).then((response) => response.json());

const event = events.collection.find(
  (event) => event.scheduling_url === EVENT_URL,
);
console.log(event.uri.replace("https://api.calendly.com/event_types/", ""));
