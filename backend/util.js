const { ObjectId } = require('mongodb');

function toObjectId(id) {
  try {
    return new ObjectId(String(id));
  } catch (_) {
    return null;
  }
}

function startOfDayUTC(dateStr) {
  return new Date(`${dateStr}T00:00:00.000Z`);
}

function endOfDayUTC(dateStr) {
  return new Date(`${dateStr}T23:59:59.999Z`);
}

function isoAtHourUTC(dateStr, hour) {
  const hh = String(hour).padStart(2, '0');
  return new Date(`${dateStr}T${hh}:00:00.000Z`);
}

function generateHourlySlots(dateStr, startHour, endHourExclusive) {
  const slots = [];
  for (let h = startHour; h < endHourExclusive; h += 1) {
    const start = isoAtHourUTC(dateStr, h);
    const end = isoAtHourUTC(dateStr, h + 1);
    slots.push({ start, end });
  }
  return slots;
}

module.exports = { toObjectId, startOfDayUTC, endOfDayUTC, isoAtHourUTC, generateHourlySlots };


