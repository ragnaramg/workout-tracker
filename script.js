// script.js
// Dynamically renders the workout program defined by a JSON object
// and provides per-exercise logging with localStorage persistence.

document.addEventListener('DOMContentLoaded', () => {
  /**
   * Define the workout program. This object mirrors the JSON configuration
   * provided by the user. Each day contains one or more sections. Sections
   * of type "main_lift" describe a single exercise, while sections of type
   * "superset" contain an array of exercises. Each exercise includes
   * information about sets, reps, and tempo.
   */
  const workoutProgram = {
    program_name: "4-Week Allegiate Hypertrophy Block",
    weeks: 4,
    tempo: "4-0-1-0",
    days: [
      {
        day: "Day 1",
        focus: "Upper Body Pull",
        sections: [
          {
            type: "main_lift",
            name: "Neutral-Grip Pull-ups",
            sets: 4,
            reps: "6–8",
            tempo: "4-0-1-0"
          },
          {
            type: "superset",
            name: "Superset A",
            exercises: [
              {
                name: "Chest-Supported DB Row",
                sets: 3,
                reps: 10,
                tempo: "4-0-1-0"
              },
              {
                name: "Rear Delt DB Fly",
                sets: 3,
                reps: 15,
                tempo: "4-0-1-0"
              }
            ]
          },
          {
            type: "superset",
            name: "Superset B",
            exercises: [
              {
                name: "Incline DB Curl",
                sets: 3,
                reps: "10–12",
                tempo: "4-0-1-0"
              },
              {
                name: "Band Hammer Curl",
                sets: 3,
                reps: 15,
                tempo: "4-0-1-0"
              }
            ]
          }
        ]
      },
      {
        day: "Day 2",
        focus: "Lower Body Push",
        sections: [
          {
            type: "main_lift",
            name: "Barbell Back Squat (with wedges)",
            sets: 4,
            reps: "6–8",
            tempo: "4-0-1-0"
          },
          {
            type: "superset",
            name: "Superset A",
            exercises: [
              {
                name: "Heels-Elevated Goblet Squat",
                sets: 3,
                reps: "12–15",
                tempo: "4-0-1-0"
              },
              {
                name: "DB Step-Back Lunge",
                sets: 3,
                reps: "8–10/leg",
                tempo: "4-0-1-0"
              }
            ]
          },
          {
            type: "superset",
            name: "Superset B",
            exercises: [
              {
                name: "DB Glute Bridge (3s squeeze)",
                sets: 3,
                reps: 12,
                tempo: "4-0-1-0"
              },
              {
                name: "Weighted Dead Bug",
                sets: 3,
                reps: 15,
                tempo: "controlled"
              }
            ]
          }
        ]
      },
      {
        day: "Day 4",
        focus: "Upper Body Push",
        sections: [
          {
            type: "main_lift",
            name: "Seated DB Shoulder Press",
            sets: 4,
            reps: "6–8",
            tempo: "4-0-1-0"
          },
          {
            type: "superset",
            name: "Superset A",
            exercises: [
              {
                name: "DB Lateral Raise",
                sets: 3,
                reps: "12–15",
                tempo: "4-0-1-0"
              },
              {
                name: "Band Front Raise",
                sets: 3,
                reps: "15–20",
                tempo: "controlled"
              }
            ]
          },
          {
            type: "superset",
            name: "Superset B",
            exercises: [
              {
                name: "Band Overhead Triceps Extension",
                sets: 3,
                reps: "12–15",
                tempo: "controlled"
              },
              {
                name: "Band Kickbacks",
                sets: 3,
                reps: "15–20",
                tempo: "controlled"
              }
            ]
          }
        ]
      },
      {
        day: "Day 5",
        focus: "Lower Body Pull",
        sections: [
          {
            type: "main_lift",
            name: "Barbell Romanian Deadlift",
            sets: 4,
            reps: "8–10",
            tempo: "4-0-1-0"
          },
          {
            type: "superset",
            name: "Superset A",
            exercises: [
              {
                name: "Single-Leg DB RDL",
                sets: 3,
                reps: "8–10/leg",
                tempo: "controlled"
              },
              {
                name: "Glute March",
                sets: 3,
                reps: "12/leg",
                tempo: "controlled"
              }
            ]
          },
          {
            type: "superset",
            name: "Superset B",
            exercises: [
              {
                name: "Hamstring Slide Curls",
                sets: 3,
                reps: "8–10",
                tempo: "controlled"
              },
              {
                name: "Side Plank with Row or Hold",
                sets: 2,
                reps: "30–45s/side",
                tempo: "isometric"
              }
            ]
          }
        ]
      }
    ]
  };

  /**
   * Retrieve all logged entries from localStorage. Returns an object keyed
   * by exercise identifier. Each value is an array of entry objects.
   */
  function getEntries() {
    try {
      const stored = localStorage.getItem('workoutEntries');
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      console.error('Error parsing entries from localStorage:', e);
      return {};
    }
  }

  /**
   * Persist the given entries object to localStorage.
   */
  function saveEntries(entries) {
    localStorage.setItem('workoutEntries', JSON.stringify(entries));
  }

  /**
   * Render the entire program into the page. Iterates over days and
   * exercises, creating a structured layout. Each exercise includes
   * a log table for existing entries and a form to record new ones.
   */
  function renderProgram() {
    const container = document.getElementById('program');
    container.innerHTML = '';

    workoutProgram.days.forEach((day, dayIndex) => {
      const dayCard = document.createElement('div');
      dayCard.classList.add('bg-white', 'shadow', 'rounded', 'p-4');

      // Day header
      const dayHeader = document.createElement('h2');
      dayHeader.classList.add('text-xl', 'font-bold', 'mb-1');
      dayHeader.textContent = `${day.day}: ${day.focus}`;
      dayCard.appendChild(dayHeader);

      // Iterate sections
      day.sections.forEach((section, sectionIndex) => {
        if (section.type === 'main_lift') {
          // Render the main lift as a single exercise card
          renderExercise(dayCard, section, dayIndex, sectionIndex, 0);
        } else if (section.type === 'superset') {
          // Add a header to indicate the superset group
          const ssHeader = document.createElement('p');
          ssHeader.classList.add(
            'font-semibold',
            'text-sm',
            'text-blue-600',
            'mt-2',
            'mb-1'
          );
          // Use the provided name if available (e.g. "Superset A"), otherwise default to "Superset"
          ssHeader.textContent = section.name || 'Superset';
          dayCard.appendChild(ssHeader);
          // Render each exercise within the superset
          section.exercises.forEach((exercise, exerciseIndex) => {
            renderExercise(dayCard, exercise, dayIndex, sectionIndex, exerciseIndex);
          });
        }
      });

      container.appendChild(dayCard);
    });
  }

  /**
   * Render an individual exercise. Appends the exercise card to the given
   * parent element. Each exercise card contains a heading, a details line
   * showing sets/reps/tempo, a list of existing entries, and a form to
   * record new entries.
   *
   * @param {HTMLElement} parentEl - The element to append this exercise to.
   * @param {Object} exercise - The exercise definition from the program.
   * @param {number} dayIdx - The index of the day in the program.
   * @param {number} sectionIdx - The index of the section within the day.
   * @param {number} exerciseIdx - The index of the exercise within the section.
   */
  function renderExercise(parentEl, exercise, dayIdx, sectionIdx, exerciseIdx) {
    const exId = `d${dayIdx}_s${sectionIdx}_e${exerciseIdx}`;

    const exCard = document.createElement('div');
    exCard.classList.add('mt-4', 'p-4', 'border', 'border-gray-200', 'rounded');

    // Exercise name
    const title = document.createElement('h3');
    title.classList.add('font-semibold', 'text-lg');
    title.textContent = exercise.name;
    exCard.appendChild(title);

    // Details line (sets, reps, tempo)
    const details = document.createElement('p');
    details.classList.add('text-sm', 'text-gray-600', 'mb-2');
    let detailParts = [];
    if (exercise.sets) {
      detailParts.push(`${exercise.sets} sets`);
    }
    if (exercise.reps) {
      detailParts.push(`${exercise.reps} reps`);
    }
    if (exercise.tempo) {
      detailParts.push(`Tempo: ${exercise.tempo}`);
    }
    details.textContent = detailParts.join(' • ');
    exCard.appendChild(details);

    // Container for existing entries
    const entriesContainer = document.createElement('div');
    exCard.appendChild(entriesContainer);

    // Render the list of existing entries for this exercise
    function renderEntriesList() {
      const allEntries = getEntries();
      const exEntries = allEntries[exId] || [];
      entriesContainer.innerHTML = '';
      if (exEntries.length === 0) {
        entriesContainer.innerHTML = '<p class="text-gray-500 text-sm mb-2">No entries yet.</p>';
        return;
      }
      const table = document.createElement('table');
      table.classList.add('w-full', 'text-sm', 'mb-2');
      const thead = document.createElement('thead');
      // Include an additional Actions column for delete buttons
      thead.innerHTML = `<tr class="bg-gray-100 text-xs text-gray-700">
        <th class="px-2 py-1 text-left">Week</th>
        <th class="px-2 py-1 text-left">Weight</th>
        <th class="px-2 py-1 text-left">Reps</th>
        <th class="px-2 py-1 text-left">Sets</th>
        <th class="px-2 py-1 text-left">Notes</th>
        <th class="px-2 py-1 text-left">Actions</th>
      </tr>`;
      table.appendChild(thead);
      const tbody = document.createElement('tbody');
      exEntries.forEach((entry, idx) => {
        const tr = document.createElement('tr');
        // Build cells for entry values
        tr.innerHTML = `
          <td class="border-t px-2 py-1">${entry.week}</td>
          <td class="border-t px-2 py-1">${entry.weight}</td>
          <td class="border-t px-2 py-1">${entry.reps}</td>
          <td class="border-t px-2 py-1">${entry.sets}</td>
          <td class="border-t px-2 py-1 whitespace-pre-wrap">${entry.notes || ''}</td>
        `;
        // Create actions cell with delete button
        const actionsTd = document.createElement('td');
        actionsTd.classList.add('border-t', 'px-2', 'py-1');
        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.classList.add('text-red-600', 'hover:text-red-800', 'underline', 'text-xs');
        delBtn.textContent = 'Delete';
        delBtn.addEventListener('click', () => {
          // Remove entry at this index and update storage
          const allEntries = getEntries();
          const arr = allEntries[exId] || [];
          arr.splice(idx, 1);
          // If the array is empty after deletion, remove the key
          if (arr.length > 0) {
            allEntries[exId] = arr;
          } else {
            delete allEntries[exId];
          }
          saveEntries(allEntries);
          renderEntriesList();
        });
        actionsTd.appendChild(delBtn);
        tr.appendChild(actionsTd);
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      entriesContainer.appendChild(table);
    }

    // Initial entries render
    renderEntriesList();

    // Form to add a new entry
    const form = document.createElement('form');
    form.classList.add('grid', 'grid-cols-1', 'md:grid-cols-5', 'gap-2', 'items-end', 'mb-2');

    // Week input
    const weekDiv = document.createElement('div');
    weekDiv.classList.add('flex', 'flex-col');
    const weekLabel = document.createElement('label');
    weekLabel.classList.add('text-xs', 'font-medium', 'text-gray-700');
    weekLabel.textContent = 'Week';
    const weekInput = document.createElement('input');
    weekInput.type = 'number';
    weekInput.min = '1';
    weekInput.classList.add('border', 'border-gray-300', 'rounded', 'px-2', 'py-1', 'text-sm');
    weekDiv.appendChild(weekLabel);
    weekDiv.appendChild(weekInput);
    form.appendChild(weekDiv);

    // Weight input
    const weightDiv = document.createElement('div');
    weightDiv.classList.add('flex', 'flex-col');
    const weightLabel = document.createElement('label');
    weightLabel.classList.add('text-xs', 'font-medium', 'text-gray-700');
    weightLabel.textContent = 'Weight';
    const weightInput = document.createElement('input');
    weightInput.type = 'number';
    weightInput.step = '0.1';
    weightInput.classList.add('border', 'border-gray-300', 'rounded', 'px-2', 'py-1', 'text-sm');
    weightDiv.appendChild(weightLabel);
    weightDiv.appendChild(weightInput);
    form.appendChild(weightDiv);

    // Reps input
    const repsDiv = document.createElement('div');
    repsDiv.classList.add('flex', 'flex-col');
    const repsLabel = document.createElement('label');
    repsLabel.classList.add('text-xs', 'font-medium', 'text-gray-700');
    repsLabel.textContent = 'Reps';
    const repsInput = document.createElement('input');
    repsInput.type = 'number';
    repsInput.classList.add('border', 'border-gray-300', 'rounded', 'px-2', 'py-1', 'text-sm');
    repsDiv.appendChild(repsLabel);
    repsDiv.appendChild(repsInput);
    form.appendChild(repsDiv);

    // Sets input
    const setsDiv = document.createElement('div');
    setsDiv.classList.add('flex', 'flex-col');
    const setsLabel = document.createElement('label');
    setsLabel.classList.add('text-xs', 'font-medium', 'text-gray-700');
    setsLabel.textContent = 'Sets';
    const setsInput = document.createElement('input');
    setsInput.type = 'number';
    setsInput.classList.add('border', 'border-gray-300', 'rounded', 'px-2', 'py-1', 'text-sm');
    setsDiv.appendChild(setsLabel);
    setsDiv.appendChild(setsInput);
    form.appendChild(setsDiv);

    // Notes input
    const notesDiv = document.createElement('div');
    notesDiv.classList.add('flex', 'flex-col', 'col-span-1', 'md:col-span-2');
    const notesLabel = document.createElement('label');
    notesLabel.classList.add('text-xs', 'font-medium', 'text-gray-700');
    notesLabel.textContent = 'Notes';
    const notesInput = document.createElement('input');
    notesInput.type = 'text';
    notesInput.classList.add('border', 'border-gray-300', 'rounded', 'px-2', 'py-1', 'text-sm');
    notesDiv.appendChild(notesLabel);
    notesDiv.appendChild(notesInput);
    form.appendChild(notesDiv);

    // Submit button
    const submitDiv = document.createElement('div');
    submitDiv.classList.add('flex', 'flex-col');
    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.textContent = 'Save';
    submitBtn.classList.add('bg-blue-600', 'text-white', 'px-4', 'py-2', 'rounded', 'hover:bg-blue-700', 'text-sm', 'mt-1');
    submitDiv.appendChild(submitBtn);
    form.appendChild(submitDiv);

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      // Validate and collect values
      const week = weekInput.value.trim();
      const weight = weightInput.value.trim();
      const reps = repsInput.value.trim();
      const sets = setsInput.value.trim();
      const notes = notesInput.value.trim();
      if (!week || !weight || !reps || !sets) {
        alert('Please fill out all required fields (week, weight, reps, sets).');
        return;
      }
      const entry = { week, weight, reps, sets, notes };
      const entries = getEntries();
      if (!entries[exId]) {
        entries[exId] = [];
      }
      entries[exId].push(entry);
      saveEntries(entries);
      // Clear inputs
      weekInput.value = '';
      weightInput.value = '';
      repsInput.value = '';
      setsInput.value = '';
      notesInput.value = '';
      // Re-render entries list
      renderEntriesList();
    });

    exCard.appendChild(form);
    parentEl.appendChild(exCard);
  }

  // Kick off rendering
  renderProgram();
});