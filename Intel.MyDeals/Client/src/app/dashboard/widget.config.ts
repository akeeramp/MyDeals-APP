export const widgetConfig = [
  {
    size: {x: 0, y: 0},
    position: {row:1,col:1},
    name: "New My Deals Contracts",
    desc: "Link to add a new contract",
    icon: "intelicon-tools",
    type: "newcontract",
    canChangeSettings: true,
    canRefresh: false,
    canAdd: true
  },
  {
    size: {x: 0, y: 0},
    position: {row:1,col:1},
    name: "Search My Deals Contracts",
    desc: "Search for contracts, pricing strategies, or pricing tables by entering a name or id",
    icon: "intelicon-tools",
    type: "searchcontracts",
    canChangeSettings: true,
    canRefresh: false,
    canAdd: true
  },
  {
    size: {x: 0, y: 0},
    position: {row:2,col:2},
    name: "Deal Desk",
    desc: "Quick view of status board",
    icon: "intelicon-grid",
    type: "contractstatus",
    canChangeSettings: true,
    canRefresh: true,
    canAdd: true
  },
  {
    size: {x: 0, y: 0},
    position: {row:1,col:1},
    name: "Open Contracts By Id",
    desc: "Quickly Navigate to a contract by entering its Id",
    icon: "intelicon-tools",
    type: "opencontracts",
    canChangeSettings: false,
    canRefresh: true,
    canAdd: true
  },
  {
    size: {x: 0, y: 0},
    position: {row:1,col:1},
    name: "Recent",
    desc: "Recently visited My deals contracts or deals",
    icon: "intelicon-time-outlined",
    type: "openrecents",
    canChangeSettings: false,
    canRefresh: true,
    canAdd: true
  },
];
