import { EDGE, FAINT, LINE, SOFT, Scene, WARM } from './kit';

/*
 * Tablas: se acabo el mazo y nadie completo su mesa. Es la misma escena en
 * todos los paquetes, porque lo que se cuenta es la mesa y no un mundo: una
 * balanza en equilibrio con un monton de cartas en cada platillo y los dos
 * huecos del mazo vacios. Las cartas van boca abajo, con el reverso, que no
 * cambia ni con el tema ni con el paquete.
 */

const BACK = 'var(--back)';

function Pan({ x }: { x: number }) {
  return (
    <g strokeLinejoin="round">
      <path d={`M${x} 58L${x - 22} 96M${x} 58L${x + 22} 96`} stroke={SOFT} strokeWidth={1.2} />
      {[0, 1, 2].map((k) => (
        <rect key={k} x={x - 14 + k * 0.8} y={89 - k * 5} width={28} height={5} rx={1.5} fill={BACK} stroke={EDGE} strokeWidth={1} />
      ))}
      <circle cx={x + 1.6} cy={81.5} r={1.6} fill={WARM} />
      <path d={`M${x - 24} 96h48q-4 10-24 10t-24-10z`} fill={LINE} stroke={EDGE} strokeWidth={1.3} />
    </g>
  );
}

export function TieScene() {
  return (
    <Scene>
      <g fill="none" stroke={FAINT} strokeWidth={1.4} strokeDasharray="3 3">
        <rect x={40} y={100} width={24} height={32} rx={3} />
        <rect x={256} y={100} width={24} height={32} rx={3} />
      </g>
      <path d="M24 132H296" stroke={SOFT} strokeWidth={1.5} strokeLinecap="round" />
      <path d="M144 132h32l-5-9h-22z" fill={LINE} stroke={EDGE} strokeWidth={1.3} strokeLinejoin="round" />
      <path d="M160 123V60" stroke={EDGE} strokeWidth={5} strokeLinecap="round" />
      <path d="M160 123V60" stroke={SOFT} strokeWidth={2.6} strokeLinecap="round" />
      {/* La cruz entera oscila sobre el fiel y vuelve al equilibrio. */}
      <g className="story-sway" style={{ transformBox: 'view-box', transformOrigin: '160px 58px' }}>
        <path d="M96 58H224" stroke={EDGE} strokeWidth={5} strokeLinecap="round" />
        <path d="M96 58H224" stroke={SOFT} strokeWidth={2.6} strokeLinecap="round" />
        <Pan x={96} />
        <Pan x={224} />
      </g>
      <circle cx={160} cy={57} r={5} fill={WARM} stroke={EDGE} strokeWidth={1.3} />
    </Scene>
  );
}
