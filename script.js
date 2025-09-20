// script.js
// Handles storing workout entries in localStorage and rendering them

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('workout-form');
  const entriesContainer = document.getElementById('entries');

  // Retrieve entries from localStorage
  function getEntries() {
    try {
      return JSON.parse(localStorage.getItem('workoutEntries')) || [];
    } catch (e) {
      console.error('Error parsing localStorage:', e);
      return [];
    }
  }

  // Save entries back to localStorage
  function saveEntries(entries) {
    localStorage.setItem('workoutEntries', JSON.stringify(entries));
  }

  // Render entries table
  function renderEntries() {
    const entries = getEntries();
    if (entries.length === 0) {
      entriesContainer.innerHTML =
        '<p class="text-gray-600">No entries recorded yet. Add one above!</p>';
      return;
    }
    // Build HTML table
    let tableHtml = '<div class="overflow-x-auto">';
    tableHtml +=
      '<table class="min-w-full border border-collapse divide-y divide-gray-200">';
    tableHtml +=
      '<thead class="bg-gray-100"><tr><th class="px-3 py-2 text-left text-xs font-medium text-gray-700">Week</th><th class="px-3 py-2 text-left text-xs font-medium text-gray-700">Weight</th><th class="px-3 py-2 text-left text-xs font-medium text-gray-700">Reps</th><th class="px-3 py-2 text-left text-xs font-medium text-gray-700">Sets</th><th class="px-3 py-2 text-left text-xs font-medium text-gray-700">Notes</th></tr></thead>';
    tableHtml += '<tbody class="bg-white divide-y divide-gray-200">';
    entries.forEach((entry) => {
      tableHtml += `<tr>
        <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900">${entry.week}</td>
        <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900">${entry.weight}</td>
        <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900">${entry.reps}</td>
        <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900">${entry.sets}</td>
        <td class="px-3 py-2 whitespace-pre-wrap text-sm text-gray-900">${entry.notes}</td>
      </tr>`;
    });
    tableHtml += '</tbody></table></div>';
    entriesContainer.innerHTML = tableHtml;
  }

  // Handle form submission
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const week = form.week.value;
    const weight = form.weight.value;
    const reps = form.reps.value;
    const sets = form.sets.value;
    const notes = form.notes.value.trim();

    // Create entry object
    const entry = { week, weight, reps, sets, notes };

    // Append entry to existing entries and save
    const entries = getEntries();
    entries.push(entry);
    saveEntries(entries);

    // Reset form and re-render
    form.reset();
    renderEntries();
  });

  // Initial render
  renderEntries();
});