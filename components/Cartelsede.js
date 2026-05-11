class CartelSede extends HTMLElement {

    /* ── Atributos reactivos ── */
    static get observedAttributes() {
        return [
            "heading", "subheading", "banner",
            "body-title", "subtitle",
            "qr-src", "qr-alt", "qr-caption",
            "people-src", "people-alt"
        ];
    }

    /* ── Propiedades privadas con valores por defecto ── */
    #heading    = "LA SEDE";
    #subheading = "TE";
    #banner     = "ACOMPAÑA";
    #bodyTitle  = "El respeto no se negocia";
    #subtitle   = "¡Pará ya de acosar!";
    #qrSrc      = "";
    #qrAlt      = "QR code";
    #qrCaption  = "Escaneá y conocé tus derechos";
    #peopleSrc  = "";
    #peopleAlt  = "";

    /* ── Mapa atributo → setter de propiedad privada ── */
    #attrMap = {
        "heading":    v => { this.#heading    = v; },
        "subheading": v => { this.#subheading = v; },
        "banner":     v => { this.#banner     = v; },
        "body-title": v => { this.#bodyTitle  = v; },
        "subtitle":   v => { this.#subtitle   = v; },
        "qr-src":     v => { this.#qrSrc      = v; },
        "qr-alt":     v => { this.#qrAlt      = v; },
        "qr-caption": v => { this.#qrCaption  = v; },
        "people-src": v => { this.#peopleSrc  = v; },
        "people-alt": v => { this.#peopleAlt  = v; },
    };

    constructor() {
        super();
    }

    /* ── Ciclo de vida: conectado al DOM ── */
    connectedCallback() {
        for (const [attr, setter] of Object.entries(this.#attrMap)) {
            const val = this.getAttribute(attr);
            if (val !== null) setter(val);
        }
        this.render();
    }

    /* ── Ciclo de vida: atributo cambiado → re-render reactivo ── */
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        const setter = this.#attrMap[name];
        if (setter) setter(newValue);
        if (this.isConnected) this.render();
    }

    /* ── CSS encapsulado con @scope ──
       IMPORTANTE: @import debe ir FUERA de @scope.
       @scope con selector explícito (cartel-sede) para que aplique
       aunque el <style> esté dentro del componente sin Shadow DOM.  */
    get #styles() {
        return /* css */`
        <style>
            @keyframes card-in {
                from { opacity: 0; transform: translateY(28px) scale(.97); }
                to   { opacity: 1; transform: translateY(0)    scale(1);   }
            }
            @keyframes pulse-text {
                0%, 100% { transform: scale(1); }
                50%      { transform: scale(1.04); }
            }
            @keyframes shimmer {
                0%   { box-shadow: 0 0 0 0    rgba(255,255,255,.5); }
                70%  { box-shadow: 0 0 0 14px rgba(255,255,255,0); }
                100% { box-shadow: 0 0 0 0    rgba(255,255,255,0); }
            }
            @keyframes float-tilt {
                0%, 100% { transform: rotate(-8deg) translateY(0); }
                50%      { transform: rotate(-8deg) translateY(-4px); }
            }
            @keyframes row-in {
                from { opacity: 0; transform: translateY(12px); }
                to   { opacity: 1; transform: translateY(0); }
            }

            @scope (cartel-sede) {
                :scope {
                    display: grid;
                    place-items: center;
                    width: min(500px, 92vw);
                }
                .c-card {
                    width: 100%;
                    background: linear-gradient(180deg, #f7c561 0%, #d9a34d 45%, #b97440 100%);
                    border: 5px solid #1f2f5e;
                    border-radius: 22px;
                    box-shadow: 0 20px 40px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.35);
                    overflow: hidden;
                    display: grid;
                    grid-template-rows: auto 1fr auto;
                    animation: card-in .7s cubic-bezier(.22,1,.36,1) both;
                }
                .c-header {
                    position: relative;
                    text-align: center;
                    padding: 1.4rem 1.4rem 1rem;
                    background: linear-gradient(180deg, rgba(255,255,255,.18) 0%, rgba(255,255,255,0) 100%);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: .55rem;
                }
                .c-header::before {
                    content: "";
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 4px;
                    background: repeating-linear-gradient(
                        90deg,
                        #1f2f5e 0px, #1f2f5e 12px,
                        #ff6b35 12px, #ff6b35 24px
                    );
                }
                .c-header-top {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: .9rem;
                }
                .c-excl {
                    font-family: "Black Ops One", cursive;
                    font-size: 2.8rem;
                    color: #ff6b35;
                    line-height: 1;
                    filter: drop-shadow(0 2px 4px rgba(0,0,0,.25));
                }
                .c-heading {
                    margin: 0;
                    font-family: "Black Ops One", cursive;
                    font-size: clamp(2rem, 5vw, 2.9rem);
                    letter-spacing: .18rem;
                    color: #ffffff;
                    text-shadow: 2px 2px 0 #1f2f5e, 4px 4px 0 rgba(31,47,94,.3);
                    padding: .15rem .65rem;
                    border-radius: .45rem;
                    background: aqua;
                    animation: float-tilt 3s ease-in-out infinite;
                    display: inline-block;
                }
                .c-subheading {
                    margin: 0;
                    font-family: "Black Ops One", cursive;
                    font-size: clamp(2rem, 5vw, 2.9rem);
                    letter-spacing: .18rem;
                    color: yellow;
                    text-shadow: 2px 2px 0 #1f2f5e;
                    padding: .15rem .65rem;
                    border-radius: .45rem;
                    background: white;
                    display: inline-block;
                    animation: row-in .6s .2s both;
                }
                .c-header-bottom {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: .9rem;
                    animation: row-in .6s .35s both;
                }
                .c-banner {
                    margin: 0;
                    font-family: "Nunito", sans-serif;
                    display: inline-flex;
                    padding: .2rem .85rem;
                    background: #543d96;
                    color: #ffefef;
                    font-weight: 900;
                    font-size: 1.05rem;
                    border-radius: .6rem;
                    text-transform: uppercase;
                    letter-spacing: .12rem;
                    box-shadow: inset 0 -3px 0 rgba(0,0,0,.2), 0 4px 10px rgba(84,61,150,.4);
                    transform: rotate(8deg);
                }
                .c-body {
                    display: grid;
                    gap: 1.1rem;
                    place-items: center;
                    text-align: center;
                    padding: 1.1rem 1.2rem;
                    background: rgba(255,255,255,.08);
                }
                .c-body-title {
                    margin: 0;
                    font-family: "Nunito", sans-serif;
                    font-size: clamp(1.35rem, 4vw, 1.9rem);
                    font-weight: 900;
                    color: #3f1468;
                    text-shadow: 0 1px 0 rgba(255,255,255,.4);
                    animation: row-in .6s .45s both;
                }
                .c-subtitle {
                    margin: 0;
                    font-family: "Nunito", sans-serif;
                    font-size: clamp(1rem, 3vw, 1.35rem);
                    color: #2e1a4a;
                    font-weight: 800;
                    animation: pulse-text 2.4s ease-in-out infinite, row-in .6s .55s both;
                }
                .c-qr-wrap {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: .6rem;
                    background: rgba(255,255,255,.3);
                    border: 2px dashed rgba(31,47,94,.3);
                    border-radius: 1rem;
                    padding: .8rem 1.2rem;
                    animation: row-in .6s .65s both;
                }
                .c-qr-img {
                    width: min(110px, 24vw);
                    height: min(110px, 24vw);
                    object-fit: contain;
                    border-radius: .5rem;
                    animation: shimmer 2.2s infinite;
                }
                .c-qr-caption {
                    margin: 0;
                    font-family: "Nunito", sans-serif;
                    font-size: .88rem;
                    font-weight: 700;
                    color: #2e1a4a;
                }
                .c-footer {
                    padding: 0;
                    position: relative;
                    overflow: hidden;
                }
                .c-footer::before {
                    content: "";
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 32px;
                    background: linear-gradient(to bottom, rgba(217,163,77,.8), transparent);
                    z-index: 1;
                    pointer-events: none;
                }
                .c-people-img {
                    display: block;
                    width: 100%;
                    height: auto;
                    object-fit: cover;
                }
            }
        </style>`;
    }

    /* ── Plantilla HTML ── */
    get #template() {
        return /* html */`
        ${this.#styles}

        <article class="c-card">
            <header class="c-header">
                <div class="c-header-top">
                    <span class="c-excl">!</span>
                    <h1 class="c-heading">${this.#heading}</h1>
                </div>
                <h2 class="c-subheading">${this.#subheading}</h2>
                <div class="c-header-bottom">
                    <p class="c-banner">${this.#banner}</p>
                    <span class="c-excl">!</span>
                </div>
            </header>

            <section class="c-body">
                <h2 class="c-body-title">${this.#bodyTitle}</h2>
                <p class="c-subtitle">${this.#subtitle}</p>
                <div class="c-qr-wrap">
                    <img class="c-qr-img" src="${this.#qrSrc}" alt="${this.#qrAlt}" />
                    <p class="c-qr-caption">${this.#qrCaption}</p>
                </div>
            </section>

            <footer class="c-footer">
                <img class="c-people-img"
                     src="${this.#peopleSrc}"
                     alt="${this.#peopleAlt}" />
            </footer>
        </article>`;
    }

    /* ── Renderizado ──
       innerHTML en lugar de setHTMLUnsafe() → compatible con todos
       los navegadores. setHTMLUnsafe es Chrome 124+ (Mayo 2024) y
       puede fallar silenciosamente en GitHub Pages / otros browsers. */
    render() {
        this.innerHTML = this.#template;
    }
}

customElements.define("cartel-sede", CartelSede);