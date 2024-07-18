  // JavaScript to toggle document list visibility
  const folders = document.querySelectorAll('.folder');
  folders.forEach(folder => {
  folder.addEventListener('click', () => {
  const targetId = folder.getAttribute('data-target');
  const target = document.getElementById(targetId);

  // Toggle visibility
  if (target.style.display === 'none' || target.style.display === '') {
    target.style.display = 'block';
  } else {
    target.style.display = 'none';
  }
});
});

function toggleVisibility(id) {
    const sections = ['screening', 'green-tools' ,'hr-manuals','mygate','construction','sop-feb','sop-august','sop-june','sop-dec','sop-april','E-tendering','isms-doc','mediclaims','old-cpc-doc','old-isms-doc','pension','construction-project-management','proforma-folder1','proforma-folder2'];
    sections.forEach(sectionId => {
      const section = document.getElementById(sectionId);
      if (sectionId === id) {
        section.classList.toggle('hidden');
      } else {
        section.classList.add('hidden');
      }
    });
  };
  document.addEventListener("DOMContentLoaded", function () {
  const dropdown = document.getElementById('dropdownMenu');
  const button = dropdown.parentElement.querySelector('button');

  function hideDropdown() {
      dropdown.style.opacity = '0';
      dropdown.style.visibility = 'hidden';
      dropdown.style.transform = 'translate-y-0';
  }

  function showDropdown() {
      dropdown.style.opacity = '1';
      dropdown.style.visibility = 'visible';
      dropdown.style.transform = 'translate-y-5';
  }

  button.addEventListener('mouseenter', showDropdown);
  dropdown.addEventListener('mouseenter', showDropdown);
  button.addEventListener('mouseleave', () => {
      setTimeout(() => {
          if (!dropdown.matches(':hover')) {
              hideDropdown();
          }
      }, 100);
  });
  dropdown.addEventListener('mouseleave', hideDropdown);

  const links = dropdown.querySelectorAll('#hide');
  links.forEach(link => {
      link.addEventListener('click', hideDropdown);
  });
});