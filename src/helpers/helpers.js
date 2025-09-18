function eligibleUserForGroupCreation(contacts, user) {
  if (!contacts || !user?._id) return [];
  const seenIds = new Set();
  return contacts
    .flatMap((contact) => contact.members || [])
    .filter(
      (member) =>
        member._id !== user._id &&
        !seenIds.has(member._id) &&
        seenIds.add(member._id)
    );
}

export { eligibleUserForGroupCreation };
