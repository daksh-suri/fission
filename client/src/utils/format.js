export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  });

export const formatDateShort = (iso) =>
  new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

export const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

export const computeSlotTimes = (date, slot) => {
  const startTime = new Date(`${date}T${slot.startTime}:00`);
  let endTime = new Date(`${date}T${slot.endTime}:00`);

  if (endTime <= startTime) {
    endTime = new Date(endTime.getTime() + 24 * 60 * 60 * 1000);
  }

  return {
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
  };
};
