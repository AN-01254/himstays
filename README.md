# HimStays

HimStays is a booking desk for a handful of independent lodges in Himachal Pradesh. You turn a model of the room — the bed, the bukhari, the window — see which nights are still open, and leave your name on the key. The occupancy desk shows the same board the way a host would count it.

The lodges are sample houses in Manali, Shimla, McLeod Ganj, Kasol, Kaza, and Bir. Stays you book, and nights you hold for the house, are saved in this browser. Nothing is sent to a server.

## Run it

```bash
npm install
npm run dev
```

The desk is at [http://localhost:3847](http://localhost:3847).

```bash
npm test
npm run lint
npm run build
```

## How to use it

- Open a lodge and drag the room model. Dawn, afternoon, dusk, and night change the light. A taken night puts a bag on the bed.
- The trail under the booking panel is one mark per night. Hollow marks are open. Tap the first night, then the last night you want to sleep.
- Your stays lists the confirmations on this browser. Cancelling one puts those nights back.
- Occupancy is the host view: tonight's keys, the week, arrivals and departures, and a place to hold a night for the house.
