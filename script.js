/* ============================================
   zFinança — Particle System & Interactions
   ============================================ */

(function () {
    'use strict';

    // --- Particle System ---
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height;
    let particles = [];
    let animationId;
    let mouse = { x: -9999, y: -9999 };

    // Performance: adaptive particle count
    const BASE_COUNT = 80;
    const isMobile = window.innerWidth < 768;
    const PARTICLE_COUNT = isMobile ? Math.floor(BASE_COUNT * 0.4) : BASE_COUNT;

    // Colors from design system
    const COLORS = [
        'rgba(6, 214, 240, ',   // cyan
        'rgba(59, 130, 246, ',  // blue
        'rgba(139, 92, 246, ',  // purple
        'rgba(232, 236, 244, ', // white
    ];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.targetOpacity = this.opacity;
            this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
            this.twinkleSpeed = Math.random() * 0.01 + 0.005;
            this.twinklePhase = Math.random() * Math.PI * 2;
            this.life = 0;
        }

        update() {
            this.life += this.twinkleSpeed;

            // Twinkle effect
            this.opacity = this.targetOpacity + Math.sin(this.life + this.twinklePhase) * 0.15;
            this.opacity = Math.max(0.03, Math.min(0.7, this.opacity));

            // Movement
            this.x += this.speedX;
            this.y += this.speedY;

            // Mouse interaction — subtle repulsion
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                const force = (150 - dist) / 150;
                this.x += (dx / dist) * force * 0.5;
                this.y += (dy / dist) * force * 0.5;
            }

            // Wrap around
            if (this.x < -10) this.x = width + 10;
            if (this.x > width + 10) this.x = -10;
            if (this.y < -10) this.y = height + 10;
            if (this.y > height + 10) this.y = -10;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color + this.opacity + ')';
            ctx.fill();

            // Glow for larger particles
            if (this.size > 1.2) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
                ctx.fillStyle = this.color + (this.opacity * 0.15) + ')';
                ctx.fill();
            }
        }
    }

    // --- Connection lines between close particles ---
    function drawConnections() {
        const maxDist = 120;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < maxDist) {
                    const alpha = (1 - dist / maxDist) * 0.08;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(6, 214, 240, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    // --- Shooting Stars (occasional comets) ---
    let shootingStars = [];

    class ShootingStar {
        constructor() {
            this.x = Math.random() * width * 0.5;
            this.y = Math.random() * height * 0.3;
            this.length = Math.random() * 60 + 40;
            this.speed = Math.random() * 4 + 3;
            this.angle = (Math.PI / 6) + Math.random() * (Math.PI / 8);
            this.opacity = 1;
            this.decay = Math.random() * 0.015 + 0.008;
            this.thickness = Math.random() * 1.5 + 0.5;
        }

        update() {
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;
            this.opacity -= this.decay;
        }

        draw() {
            if (this.opacity <= 0) return;
            const tailX = this.x - Math.cos(this.angle) * this.length;
            const tailY = this.y - Math.sin(this.angle) * this.length;

            const gradient = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
            gradient.addColorStop(0, `rgba(6, 214, 240, ${this.opacity})`);
            gradient.addColorStop(0.3, `rgba(59, 130, 246, ${this.opacity * 0.6})`);
            gradient.addColorStop(1, `rgba(6, 214, 240, 0)`);

            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(tailX, tailY);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = this.thickness;
            ctx.lineCap = 'round';
            ctx.stroke();

            // Head glow
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.8})`;
            ctx.fill();
        }

        get isDead() {
            return this.opacity <= 0;
        }
    }

    // Spawn shooting stars occasionally
    function maybeSpawnShootingStar() {
        if (Math.random() < 0.003) {
            shootingStars.push(new ShootingStar());
        }
    }

    // --- Animation Loop ---
    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Update & draw particles
        for (const p of particles) {
            p.update();
            p.draw();
        }

        // Connection lines (skip on mobile for perf)
        if (!isMobile) {
            drawConnections();
        }

        // Shooting stars
        maybeSpawnShootingStar();
        shootingStars = shootingStars.filter(s => !s.isDead);
        for (const s of shootingStars) {
            s.update();
            s.draw();
        }

        animationId = requestAnimationFrame(animate);
    }

    // --- Init ---
    function init() {
        resize();
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }
        animate();
    }

    // --- Event Listeners ---
    window.addEventListener('resize', () => {
        resize();
        // Re-distribute particles that are out of bounds
        for (const p of particles) {
            if (p.x > width || p.y > height) {
                p.x = Math.random() * width;
                p.y = Math.random() * height;
            }
        }
    });

    // Mouse tracking for particle interaction
    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    document.addEventListener('mouseleave', () => {
        mouse.x = -9999;
        mouse.y = -9999;
    });

    // --- Container 3D tilt effect removed (was causing text blur) ---

    // Start
    init();
})();

/* ============================================
   APP LOGIC: Cadastro & Dados (LocalStorage)
   ============================================ */

const categoriasReceita = ['Salário', 'Freelance', 'Vendas', 'Investimentos', 'Rendimento', 'Presente', 'Outros'];
const categoriasDespesa = ['Alimentação', 'Moradia', 'Transporte', 'Saúde', 'Lazer', 'Educação', 'Outros'];

// --- Setup Form ---
function setType(type) {
    const btnReceita = document.getElementById('btnReceita');
    const btnDespesa = document.getElementById('btnDespesa');
    const transTypeInput = document.getElementById('transType');
    const transCategory = document.getElementById('transCategory');

    if(!btnReceita || !btnDespesa || !transTypeInput || !transCategory) return;

    if(type === 'receita') {
        btnReceita.classList.add('active');
        btnDespesa.classList.remove('active');
        transTypeInput.value = 'receita';
        renderCategories(categoriasReceita);
    } else {
        btnDespesa.classList.add('active');
        btnReceita.classList.remove('active');
        transTypeInput.value = 'despesa';
        renderCategories(categoriasDespesa);
    }
}

function renderCategories(categories) {
    const select = document.getElementById('transCategory');
    if(!select) return;
    
    select.innerHTML = '';
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        select.appendChild(option);
    });
}

// Inicializar form category se estiver na página de cadastro
document.addEventListener('DOMContentLoaded', () => {
    if(document.getElementById('transCategory')) {
        renderCategories(categoriasReceita); // load default
    }
});

function handleFormSubmit(e) {
    e.preventDefault();
    
    // Ler form
    const type = document.getElementById('transType').value;
    const date = document.getElementById('transDate').value;
    const value = parseFloat(document.getElementById('transValue').value);
    const category = document.getElementById('transCategory').value;
    const subCategory = document.getElementById('transSubCategory').value;
    const desc = document.getElementById('transDesc').value;

    const record = {
        id: Date.now().toString(),
        type,
        date,
        value,
        category,
        subCategory,
        desc
    };

    let data = JSON.parse(localStorage.getItem('zFinanca_dados')) || [];
    data.push(record);
    localStorage.setItem('zFinanca_dados', JSON.stringify(data));

    // Animação de sucesso no botão
    const btn = document.querySelector('.btn-submit');
    const originalText = btn.innerHTML;
    btn.innerHTML = `<i data-lucide="check-circle" style="vertical-align:middle; width:20px; margin-right:8px;"></i> Salvo com Sucesso!`;
    btn.style.background = 'var(--color-success)';
    lucide.createIcons();
    
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        lucide.createIcons();
        document.getElementById('transactionForm').reset();
        document.getElementById('transDate').valueAsDate = new Date();
    }, 2000);
}

// --- Listagem (Dados) ---
function loadTableData() {
    const tbody = document.getElementById('dataTableBody');
    if(!tbody) return;

    const data = JSON.parse(localStorage.getItem('zFinanca_dados')) || [];
    tbody.innerHTML = '';

    if(data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="empty-state">
            <i data-lucide="inbox"></i>
            <p>Nenhum dado cadastrado ainda.</p>
        </td></tr>`;
        lucide.createIcons();
        return;
    }

    // Sort by Date Descending
    data.sort((a,b) => new Date(b.date) - new Date(a.date));

    data.forEach(item => {
        const tr = document.createElement('tr');
        
        // formats
        const dateObj = new Date(item.date);
        const dateStr = [
            String(dateObj.getUTCDate()).padStart(2, '0'),
            String(dateObj.getUTCMonth() + 1).padStart(2, '0'),
            dateObj.getUTCFullYear()
        ].join('/');

        const valStr = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.value);
        const badgeClass = item.type === 'receita' ? 'badge receita' : 'badge despesa';
        const typeLabel = item.type === 'receita' ? 'Receita' : 'Despesa';

        let catDisplay = `<strong>${item.category}</strong>`;
        if(item.subCategory) {
            catDisplay += `<br><span style="font-size:0.8em; opacity:0.7;">${item.subCategory}</span>`;
        }

        tr.innerHTML = `
            <td>${dateStr}</td>
            <td>${item.desc || '-'}</td>
            <td>${catDisplay}</td>
            <td><span class="${badgeClass}">${typeLabel}</span></td>
            <td style="font-weight:600; color: ${item.type === 'receita' ? 'var(--color-success)' : 'var(--color-danger)'}">${valStr}</td>
            <td style="text-align:center;">
                <button class="btn-icon" onclick="deleteRecord('${item.id}')" title="Excluir">
                    <i data-lucide="trash-2" width="18"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    lucide.createIcons();
}

function deleteRecord(id) {
    if(!confirm("Tem certeza que deseja excluir este registro?")) return;

    let data = JSON.parse(localStorage.getItem('zFinanca_dados')) || [];
    data = data.filter(d => d.id !== id);
    localStorage.setItem('zFinanca_dados', JSON.stringify(data));
    
    // Recarregar
    loadTableData();
}

// --- CSV Funcs ---
function exportCSV() {
    const data = JSON.parse(localStorage.getItem('zFinanca_dados')) || [];
    if(data.length === 0) return alert('Sem dados para exportar');

    const headers = ['Data', 'Tipo', 'Categoria', 'SubCategoria', 'Valor', 'Descrição'];
    const rows = data.map(d => {
        return [
            d.date, 
            d.type, 
            d.category, 
            d.subCategory || '', 
            d.value.toString().replace('.', ','), 
            `"${(d.desc || '').replace(/"/g, '""')}"`
        ].join(';');
    });

    const csvContent = headers.join(';') + "\n" + rows.join("\n");
    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `zFinanca_Export_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function importCSV(e) {
    const file = e.target.files[0];
    if(!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        const text = event.target.result;
        const lines = text.split('\n').filter(l => l.trim().length > 0);
        
        // assuming first line is header
        const dataLines = lines.slice(1);
        const records = JSON.parse(localStorage.getItem('zFinanca_dados')) || [];

        dataLines.forEach(line => {
            const cols = line.split(';');
            if(cols.length >= 6) {
                records.push({
                    id: Date.now().toString() + Math.random(),
                    date: cols[0],
                    type: cols[1],
                    category: cols[2],
                    subCategory: cols[3],
                    value: parseFloat(cols[4].replace(',', '.')),
                    desc: cols[5].replace(/^"|"$/g, '').replace(/""/g, '"')
                });
            }
        });

        localStorage.setItem('zFinanca_dados', JSON.stringify(records));
        loadTableData();
        e.target.value = ''; // reset input
        alert('Importação concluída com sucesso!');
    };
    reader.readAsText(file);
}
