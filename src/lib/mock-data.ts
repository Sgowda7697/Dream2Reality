export const MOCK_FLIGHTS: Record<string, { from: string; to: string;
airline: string; price: number; }[]> = {
Goa: [
{ from: "BLR", to: "GOI", airline: "IndiGo", price: 3200 },
{ from: "BOM", to: "GOI", airline: "Air India", price: 4100 },
],
Mysore: [
{ from: "BLR", to: "MYQ", airline: "Alliance Air", price: 2200 },
],
};
export const MOCK_HOTELS: Record<string, { name: string; area?: string;
pricePerNight: number; }[]> = {
Goa: [
{ name: "Taj Fort Aguada", area: "Candolim", pricePerNight: 9000 },
{ name: "Fairfield Anjuna", area: "Anjuna", pricePerNight: 4800 },
],
Mysore: [
{ name: "Radisson Blu", area: "CBD", pricePerNight: 4500 },
{ name: "Fortune JP Palace", area: "Nazarbad", pricePerNight: 3800 },
],
};