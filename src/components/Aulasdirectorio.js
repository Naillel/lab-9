/* ═══════════════════════════════════════════
   <aula-item>  —  fila individual del directorio
   ═══════════════════════════════════════════ */
class AulaItem extends HTMLElement {

    static get observedAttributes() {
        return ["label", "icono"];
    }

    #label = "";
    #icono = "→";
    #index = 0;

    constructor() {
        super();
    }

    connectedCallback() {
        this.#label = this.getAttribute("label") ?? this.#label;
        this.#icono = this.getAttribute("icono") ?? this.#icono;

        // Calcular posición dentro del padre para animación escalonada
        const siblings = [...(this.parentElement?.querySelectorAll("aula-item") ?? [])];
        this.#index = siblings.indexOf(this);

        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        if (name === "label") this.#label = newValue;
        if (name === "icono") this.#icono = newValue;
        if (this.isConnected) this.render();
    }

    render() {
        const delay = (this.#index * 0.1 + 0.4).toFixed(2);

        /* ── innerHTML en lugar de setHTMLUnsafe ── */
        this.innerHTML = /* html */`
        <style>
            @keyframes item-in-${this.#index} {
                from { opacity: 0; transform: translateX(-18px); }
                to   { opacity: 1; transform: translateX(0); }
            }
            @scope (aula-item) {
                :scope {
                    display: grid;
                    grid-template-columns: auto 1fr auto;
                    align-items: center;
                    gap: .75rem;
                    padding: .8rem 1rem;
                    background: rgba(255,255,255,.08);
                    border-left: 4px solid rgba(255,255,255,.15);
                    border-radius: 0 .6rem .6rem 0;
                    cursor: default;
                    transition: background .25s ease, border-left-color .25s ease, transform .2s ease;
                    animation: item-in-${this.#index} .5s ${delay}s cubic-bezier(.22,1,.36,1) both;
                }
                :scope:hover {
                    background: rgba(128,0,128,.45);
                    border-left-color: #c084fc;
                    transform: translateX(4px);
                }
                :scope:hover .ai-label,
                :scope:hover .ai-arrow {
                    color: #f3e8ff;
                }
                .ai-icon {
                    font-size: 1.2rem;
                    line-height: 1;
                    transition: transform .2s;
                }
                :scope:hover .ai-icon {
                    transform: scale(1.25) rotate(-5deg);
                }
                .ai-label {
                    font-family: "Nunito", sans-serif;
                    font-size: clamp(.88rem, 2.5vw, 1.05rem);
                    font-weight: 700;
                    color: #e8f0ff;
                    letter-spacing: .01rem;
                    transition: color .25s;
                }
                .ai-arrow {
                    font-family: "Nunito", sans-serif;
                    font-size: 1.4rem;
                    font-weight: 900;
                    color: rgba(255,255,255,.6);
                    transition: color .25s, transform .2s;
                }
                :scope:hover .ai-arrow {
                    transform: translateX(4px);
                }
            }
        </style>
        <span class="ai-icon">${this.#icono}</span>
        <span class="ai-label">${this.#label}</span>
        <span class="ai-arrow">›</span>
        `;
    }
}

customElements.define("aula-item", AulaItem);


/* ═══════════════════════════════════════════
   <aulas-directorio>  —  tarjeta contenedora
   ═══════════════════════════════════════════ */
class AulasDirectorio extends HTMLElement {

    static get observedAttributes() {
        return ["wave-src", "back-href"];
    }

    #waveSrc  = "abstract-white-waves-png.png";
    #backHref = "index.html";
    #items    = [];

    constructor() {
        super();
        /* ── Leer hijos en el constructor ──
           En este punto el HTML declarado en el documento aún existe.
           Usamos un <template> temporal para parsear los <aula-item>
           hijos de forma segura, ANTES de que render() los borre.    */
        const tpl = document.createElement("template");
        tpl.innerHTML = this.innerHTML;
        this.#items = [...tpl.content.querySelectorAll("aula-item")].map(el => ({
            label: el.getAttribute("label") ?? "",
            icono: el.getAttribute("icono") ?? "→",
        }));
    }

    connectedCallback() {
        this.#waveSrc  = this.getAttribute("wave-src")  ?? this.#waveSrc;
        this.#backHref = this.getAttribute("back-href") ?? this.#backHref;
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        if (name === "wave-src")  this.#waveSrc  = newValue;
        if (name === "back-href") this.#backHref = newValue;
        if (this.isConnected) this.render();
    }

    /* Genera las filas <aula-item> reconstruidas desde los datos guardados */
    get #itemsHTML() {
        return this.#items
            .map(({ label, icono }) =>
                `<aula-item label="${label}" icono="${icono}"></aula-item>`)
            .join("\n");
    }

    /* ── CSS encapsulado ──
       @keyframes fuera de @scope (compatibilidad).
       @scope con selector explícito (aulas-directorio).             */
    get #styles() {
        return /* css */`
        <style>
            @keyframes card-in {
                from { opacity: 0; transform: translateY(24px) scale(.98); }
                to   { opacity: 1; transform: translateY(0)    scale(1);   }
            }
            @keyframes wave-drift {
                0%, 100% { transform: translateX(0)   scaleY(1); }
                50%      { transform: translateX(-8px) scaleY(1.03); }
            }
            @keyframes badge-glow {
                0%, 100% { box-shadow: 0 0 0 0   rgba(255,255,255,0); }
                50%      { box-shadow: 0 0 18px 4px rgba(200,220,255,.25); }
            }
            @keyframes title-in {
                from { opacity: 0; letter-spacing: .4rem; }
                to   { opacity: 1; letter-spacing: .12rem; }
            }

            @scope (aulas-directorio) {
                :scope {
                    display: grid;
                    place-items: center;
                    width: min(500px, 92vw);
                }
                .ad-card {
                    position: relative;
                    width: 100%;
                    background: #1b2f72;
                    border-radius: 18px;
                    overflow: hidden;
                    display: grid;
                    grid-template-rows: auto auto auto auto;
                    box-shadow: 0 24px 48px rgba(10,20,60,.45), inset 0 1px 0 rgba(255,255,255,.12);
                    animation: card-in .65s cubic-bezier(.22,1,.36,1) both;
                }
                .ad-card::before {
                    content: "";
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 3px;
                    background: linear-gradient(90deg, #4f7bdc 0%, #a5c0f7 40%, #4f7bdc 80%, #2b4fa8 100%);
                    z-index: 5;
                }
                .ad-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 1.3rem 1.3rem .9rem;
                    background: linear-gradient(180deg, rgba(255,255,255,.1) 0%, rgba(255,255,255,0) 100%);
                }
                .ad-title {
                    margin: 0;
                    font-family: "Black Ops One", cursive;
                    font-size: clamp(1.4rem, 4vw, 1.9rem);
                    color: #e8f2ff;
                    letter-spacing: .12rem;
                    text-shadow: 0 2px 8px rgba(0,0,0,.4);
                    animation: title-in .8s .1s cubic-bezier(.22,1,.36,1) both;
                }
                .ad-badge {
                    font-family: "Nunito", sans-serif;
                    font-size: .72rem;
                    font-weight: 900;
                    color: #1b2f72;
                    background: #e8f2ff;
                    padding: .25rem .6rem;
                    border-radius: 2rem;
                    letter-spacing: .05rem;
                    text-transform: uppercase;
                    animation: badge-glow 3s ease-in-out infinite;
                }
                .ad-divider {
                    height: 1px;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        rgba(255,255,255,.2) 30%,
                        rgba(255,255,255,.2) 70%,
                        transparent
                    );
                    margin: 0 1rem;
                }
                .ad-list {
                    display: grid;
                    gap: .4rem;
                    padding: .8rem 1rem 1rem;
                }
                .ad-wave {
                    position: relative;
                    height: 110px;
                    overflow: hidden;
                }
                .ad-wave-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    opacity: .92;
                    animation: wave-drift 7s ease-in-out infinite;
                }
                .ad-wave-label {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: "Black Ops One", cursive;
                    font-size: 1.6rem;
                    color: #1b2f72;
                    letter-spacing: .25rem;
                    text-shadow: 0 1px 3px rgba(255,255,255,.5);
                    pointer-events: none;
                }
                .ad-back {
                    position: absolute;
                    top: 1.1rem;
                    right: 1.1rem;
                    font-family: "Nunito", sans-serif;
                    font-size: .82rem;
                    font-weight: 900;
                    text-decoration: none;
                    color: #1b2f72;
                    background: #e8f2ff;
                    padding: .35rem .75rem;
                    border-radius: 2rem;
                    letter-spacing: .03rem;
                    transition: background .2s, transform .15s;
                    z-index: 10;
                }
                .ad-back:hover {
                    background: #ffffff;
                    transform: translateY(-2px);
                }
            }
        </style>`;
    }

    get #template() {
        return /* html */`
        ${this.#styles}

        <article class="ad-card">
            <header class="ad-header">
                <h1 class="ad-title">Directorio</h1>
                <span class="ad-badge">UCR · Sede</span>
            </header>

            <div class="ad-divider"></div>

            <section class="ad-list">
                ${this.#itemsHTML}
            </section>

            <div class="ad-wave">
                <img class="ad-wave-img"
                     src="${this.#waveSrc}"
                     alt="Decoración de ola" />
                <div class="ad-wave-label">UCR</div>
            </div>

            <a href="${this.#backHref}" class="ad-back">← Volver</a>
        </article>`;
    }

    /* ── Renderizado ──
       innerHTML en lugar de setHTMLUnsafe() → compatible con todos
       los navegadores modernos sin depender de Chrome 124+.         */
    render() {
        this.innerHTML = this.#template;
    }
}

customElements.define("aulas-directorio", AulasDirectorio);