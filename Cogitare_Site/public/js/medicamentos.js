document.addEventListener('DOMContentLoaded', function () {
  const buttons = document.querySelectorAll('.btn-open-delete');
  const confirmName = document.getElementById('confirmDeleteName');
  const deleteForm = document.getElementById('deleteForm');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const name = btn.dataset.name || '';
      if (confirmName) confirmName.textContent = name;
      if (deleteForm) deleteForm.action = `/medicamentos/deletar/${id}`;
    });
  });
});
