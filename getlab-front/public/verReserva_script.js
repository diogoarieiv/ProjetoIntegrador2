// Verificar se usuário está logado
const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));
if (!usuarioLogado) {
  window.location.href = "login.html";
}

// Verificar se é docente para mostrar seção de reserva
if (
  usuarioLogado &&
  usuarioLogado.email &&
  usuarioLogado.email.includes("@fmpsc.edu.br")
) {
  document.getElementById("reservaSection").style.display = "block";
}

// Carregar informações do laboratório selecionado
const laboratorioSelecionado = JSON.parse(
  localStorage.getItem("laboratorioSelecionado")
);
if (laboratorioSelecionado) {
  document.getElementById("labNome").textContent = laboratorioSelecionado.nome;
  document.getElementById(
    "labDetalhes"
  ).textContent = `Laboratório selecionado: ${laboratorioSelecionado.nome}`;
} else {
  document.getElementById("labNome").textContent =
    "Nenhum laboratório selecionado";
  document.getElementById("labDetalhes").textContent =
    "Volte para a página de laboratórios e selecione um laboratório.";
}

// Calendário personalizado
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];
// Função para carregar reservas do mês
async function carregarReservasDoMes(laboratorioId, ano, mes) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/reservas/calendario/${laboratorioId}/${ano}/${
        mes + 1
      }`
    );
    const reservas = await response.json();
    return reservas;
  } catch (error) {
    console.error("Erro ao carregar reservas:", error);
    return [];
  }
}

// Carregar e exibir reservas do laboratório
async function carregarReservasLaboratorio() {
  if (!laboratorioSelecionado) {
    document.getElementById("listaReservas").innerHTML =
      "<p>Nenhum laboratório selecionado.</p>";
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3000/api/reservas/laboratorio/${laboratorioSelecionado.id}`
    );
    const reservas = await response.json();

    const lista = document.getElementById("listaReservas");
    lista.innerHTML = "";

    if (reservas.length === 0) {
      lista.innerHTML = "<p>Não há reservas para este laboratório.</p>";
      return;
    }

    reservas.forEach((reserva) => {
      const item = document.createElement("div");
      item.className = "reserva-item";

      // Corrigindo a formatação da data
      const dataFormatada = new Date(reserva.data).toLocaleDateString("pt-BR");
      const horaInicio = reserva.horaInicio;
      const horaFim = reserva.horaFim;

      item.innerHTML = `
                <p><strong>Docente:</strong> ${reserva.usuario.nome} (${
        reserva.usuario.email
      })</p>
                <p><strong>Data:</strong> ${dataFormatada} das ${horaInicio} às ${horaFim}</p>
                <p><strong>Status:</strong> <span class="${
                  reserva.status
                }">${reserva.status.toUpperCase()}</span></p>
                <hr>
            `;

      lista.appendChild(item);
    });
  } catch (error) {
    console.error("Erro ao carregar reservas do laboratório:", error);
    document.getElementById("listaReservas").innerHTML =
      "<p>Erro ao carregar reservas.</p>";
  }
}

function generateCalendar(month, year) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  document.getElementById(
    "currentMonth"
  ).textContent = `${months[month]} ${year}`;

  const calendarGrid = document.getElementById("calendarGrid");
  // Limpar dias anteriores (manter cabeçalhos)
  const dayHeaders = calendarGrid.querySelectorAll(".day-header");
  calendarGrid.innerHTML = "";
  dayHeaders.forEach((header) => calendarGrid.appendChild(header));

  // Adicionar dias vazios do início
  for (let i = 0; i < firstDay; i++) {
    const emptyDay = document.createElement("div");
    emptyDay.className = "calendar-day empty";
    calendarGrid.appendChild(emptyDay);
  }

  // Carregar reservas do mês se houver laboratório selecionado
  if (laboratorioSelecionado) {
    carregarReservasDoMes(laboratorioSelecionado.id, year, month).then(
      (reservas) => {
        // Criar mapa de reservas por dia
        const reservasPorDia = {};
        reservas.forEach((reserva) => {
          const dataReserva = new Date(reserva.data);
          const dia = dataReserva.getDate();
          if (!reservasPorDia[dia]) {
            reservasPorDia[dia] = [];
          }
          reservasPorDia[dia].push(reserva);
        });

        // Adicionar dias do mês
        for (let day = 1; day <= daysInMonth; day++) {
          const dayElement = document.createElement("div");
          dayElement.className = "calendar-day";
          dayElement.textContent = day;

          // Verificar status de reserva real
          if (reservasPorDia[day]) {
            const reservasNoDia = reservasPorDia[day];
            const temAprovada = reservasNoDia.some(
              (r) => r.status === "aprovado"
            );
            const temPendente = reservasNoDia.some(
              (r) => r.status === "pendente"
            );

            if (temAprovada) {
              dayElement.classList.add("ocupado");
              dayElement.style.backgroundColor = "#ff4444"; // Vermelho para dias ocupados
              dayElement.style.cursor = "not-allowed"; // Cursor indicando que não é clicável
            } else if (temPendente) {
              dayElement.classList.add("pendente");
              dayElement.style.backgroundColor = "#ffd700"; // Amarelo para dias pendentes
              dayElement.style.cursor = "not-allowed";
            } else {
              dayElement.classList.add("disponivel");
              dayElement.style.backgroundColor = "#90EE90"; // Verde claro para dias disponíveis
            }
          } else {
            dayElement.classList.add("disponivel");
            dayElement.style.backgroundColor = "#90EE90"; // Verde claro para dias disponíveis
          }

          // Adicionar evento de clique apenas para dias disponíveis
          if (!dayElement.classList.contains("ocupado") && !dayElement.classList.contains("pendente")) {
            dayElement.addEventListener("click", function () {
              const selectedDate = new Date(year, month, day);
              document.getElementById("dataReserva").value = selectedDate
                .toISOString()
                .split("T")[0];
              
              // Mostrar o formulário de reserva
              document.getElementById("reservaSection").style.display = "block";
              
              // Rolar até o formulário
              document.getElementById("reservaSection").scrollIntoView({ behavior: 'smooth' });
            });
          }

          calendarGrid.appendChild(dayElement);
        }
      }
    );
  } else {
    // Se não há laboratório selecionado, mostrar todos como disponíveis
    for (let day = 1; day <= daysInMonth; day++) {
      const dayElement = document.createElement("div");
      dayElement.className = "calendar-day disponivel";
      dayElement.textContent = day;

      dayElement.addEventListener("click", function () {
        const selectedDate = new Date(year, month, day);
        document.getElementById("dataReserva").value = selectedDate
          .toISOString()
          .split("T")[0];
      });

      calendarGrid.appendChild(dayElement);
    }
  }
}

// Event listeners para navegação do calendário
document.getElementById("prevMonth").addEventListener("click", function () {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  generateCalendar(currentMonth, currentYear);
});

document.getElementById("nextMonth").addEventListener("click", function () {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  generateCalendar(currentMonth, currentYear);
});

// Formulário de reserva
document
  .getElementById("reservaForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = {
      laboratorioId: laboratorioSelecionado.id,
      usuarioId: usuarioLogado.usuario.id,
      data: document.getElementById("dataReserva").value,
      horaInicio: document.getElementById("horaInicio").value,
      horaFim: document.getElementById("horaFim").value,
      descricao: document.getElementById("descricao").value,
      status: "pendente"
    };

    try {
      const response = await fetch("http://localhost:3000/api/reservas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Registrar a solicitação no sistema
        await registrarAcao({
          docente: usuarioLogado.usuario.nome,
          email: usuarioLogado.usuario.email,
          data: new Date().toISOString(),
          status: "Solicitação de reserva enviada",
          detalhes: `Solicitação de reserva do laboratório ${laboratorioSelecionado.nome} para ${formData.data} das ${formData.horaInicio} às ${formData.horaFim} para ${formData.descricao}`
        });

        alert("Solicitação de reserva enviada com sucesso! Aguarde a aprovação do administrador.");
        document.getElementById("reservaForm").reset();
        document.getElementById("reservaSection").style.display = "none";

        // Recarregar calendário e lista de reservas
        generateCalendar(currentMonth, currentYear);
        carregarReservasLaboratorio();
      } else {
        const error = await response.json();
        alert("Erro ao enviar solicitação: " + (error.message || "Tente novamente."));
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao conectar com o servidor.");
    }
  });

// Função para registrar ações no sistema
async function registrarAcao(registro) {
  try {
    await fetch("http://localhost:3000/api/registros", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registro)
    });
  } catch (error) {
    console.error("Erro ao registrar ação:", error);
  }
}

// Logout
document.getElementById("btnSair").addEventListener("click", async function (e) {
  e.preventDefault();
  
  // Registrar o logout
  await registrarAcao({
    docente: usuarioLogado.usuario.nome,
    email: usuarioLogado.usuario.email,
    data: new Date().toISOString(),
    status: "Logout realizado",
    detalhes: `Usuário realizou logout do sistema`
  });

  localStorage.removeItem("usuario");
  localStorage.removeItem("laboratorioSelecionado");
  window.location.href = "index.html";
});

// Carregar calendário ao carregar a página
document.addEventListener("DOMContentLoaded", function () {
  generateCalendar(currentMonth, currentYear);
});

document.addEventListener('DOMContentLoaded', () => {
    carregarReservasLaboratorio();
});
