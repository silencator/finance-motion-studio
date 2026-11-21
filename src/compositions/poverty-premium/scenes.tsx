import React from 'react';
import {FLOOR, c, ease} from '../../design/tokens';
import {useT} from '../../lib/time';
import {Floor, Halo, Spot, World, floorCam} from '../../kit/stage';
import {Badge, Basket, Coin, CoinStack, Drop, Figure, Icon, Jar, Label, Pack, Pop, pose, type IconName} from '../../kit/shapes';
import {Title} from '../../kit/title';
import {w} from './words';

const range = (n: number, start: number, step: number) => Array.from({length: n}, (_, i) => start + i * step);
const GROCERIES: IconName[] = ['milk', 'bread', 'apple', 'can'];

/** Groceries poking out of a basket, popping in from `at`. */
const Groceries: React.FC<{at: number; step?: number}> = ({at, step = 0.12}) => (
  <>
    {GROCERIES.map((n, i) => (
      <Pop key={n} at={at + i * step} x={-54 + i * 36} y={-96 - (i % 2) * 10}>
        <Icon name={n} s={0.7} />
      </Pop>
    ))}
  </>
);

/* S1 — same groceries, one pays more */
export const S1: React.FC = () => {
  const {kf, p} = useT();
  const more = p(w.more, 0.4);
  return (
    <World cam={floorCam(730, kf([[0, 1.3], [5, 1.38]]))}>
      <Spot x={385} />
      <Spot x={1055} op={p(w.someone, 0.5)} />
      <Floor />
      <Figure x={290} arms={[12, 50]} />
      <Basket x={480}><Groceries at={w.groceries} /></Basket>
      <Pop at={w.someone + 0.05}>
        <Figure x={1150} arms={[50, 12]} />
        <Basket x={960}><Groceries at={w.someone + 0.15} step={0.06} /></Basket>
      </Pop>
      <CoinStack x={640} times={range(4, w.paying, 0.09)} />
      <Halo x={800} y={FLOOR - 75} r={110} op={more} />
      <CoinStack x={800} times={[...range(4, w.paying, 0.09), w.more, w.more + 0.1]} hl={w.more} hlFrom={4} />
    </World>
  );
};

/* S2 — big pack vs small pack: wide set, camera pans left → right across the per-item chart */
const BarCol: React.FC<{x: number; h: number; at: number; icon: React.ReactNode; hi?: boolean; dur?: number}> = ({x, h, at, icon, hi, dur = 0.6}) => {
  const {p} = useT();
  const k = p(at, dur, ease.out);
  const base = 840;
  return (
    <g>
      {k > 0 && <rect x={x - 45} y={base - h * k} width={90} height={h * k} rx={4} fill={hi ? 'url(#barFill)' : c.fill2} stroke={c.line} strokeWidth={3} filter="url(#glow)" />}
      <Pop at={at - 0.25} x={x} y={base + 32}>{icon}</Pop>
    </g>
  );
};

export const S2: React.FC = () => {
  const {kf, p, t} = useT();
  const camX = kf([[w.one, 450], [7.2, 450], [7.9, 900], [10.6, 900], [11.5, 1560], [12.3, 1560], [13.0, 1460]]);
  const camS = kf([[w.one, 1.45], [7.2, 1.5], [7.9, 1.22], [10.6, 1.26], [11.5, 1.35], [12.3, 1.38], [13.0, 1.2], [17.6, 1.26]]);
  const axes = p(7.35, 0.5);
  const jarFill = kf([[9.3, 0], [10.4, 0.62]], ease.out);
  return (
    <World cam={floorCam(camX, camS)}>
      <Spot x={360} />
      <Spot x={1750} op={p(w.other, 0.6)} />
      <Floor x1={-400} x2={2700} />
      {/* left: can afford the big pack, saves over time */}
      <Figure x={250} arms={t > w.afford ? pose.holdR : pose.idle} />
      <Drop at={w.big - 0.05}><Pack x={470} cols={4} rows={3} cell={40} /></Drop>
      <Pop at={w.save - 0.35}><Jar x={680} fill={jarFill} /></Pop>
      {range(4, w.save, 0.3).map((at, i) => (
        <Drop key={i} at={at} x={680} y={FLOOR - 150} h={200} dur={0.3}><Coin r={20} /></Drop>
      )).filter((_, i) => t < w.save + i * 0.3 + 0.32)}
      {/* per-item chart (shared by both halves) */}
      <g opacity={axes} filter="url(#glow)">
        <path d={`M930 ${840 - 420 * axes} V840 H${930 + 470 * axes}`} fill="none" stroke={c.line} strokeWidth={3} />
      </g>
      <Pop at={7.6}><Label x={942} y={408} text="PER ITEM" anchor="start" /></Pop>
      <BarCol x={1050} h={120} at={w.per} icon={<Pack x={0} y={22} cols={4} rows={3} cell={11} />} />
      <BarCol x={1280} h={330} at={12.9} hi icon={<Pack x={0} y={22} cols={2} rows={2} cell={11} />} dur={0.7} />
      <Pop at={w.better}><Icon name="tag" x={1280} y={440} s={0.9} /></Pop>
      <Pop at={w.deal + 0.1}><Badge name="cross" x={1318} y={418} r={22} filled /></Pop>
      {/* right: buys what they can afford today */}
      <Pop at={w.other + 0.05}><Figure x={1880} arms={t > w.because2 + 0.1 ? pose.hold : pose.idle} /></Pop>
      <Drop at={w.smaller + 0.05}><Pack x={1640} cols={2} rows={2} cell={40} /></Drop>
      <Pop at={w.because2 + 0.15} x={1790} y={FLOOR - 150}>
        <Icon name="wallet" s={0.9} />
      </Pop>
      <Pop at={w.afford2 - 0.1} x={1790} y={FLOOR - 205}><Coin r={13} /></Pop>
      <Pop at={w.afford2 + 0.05} x={1640} y={FLOOR - 270}>
        <Pack x={0} y={60} cols={4} rows={3} cell={40} dashed op={0.7} />
      </Pop>
      <Halo x={1640} y={FLOOR - 60} r={130} op={p(w.today, 0.4)} />
      <Pop at={w.today + 0.05}><Badge name="check" x={1640} y={FLOOR - 125} r={22} /></Pop>
    </World>
  );
};

/* S3 — beyond the supermarket: pull-out reveal */
export const S3: React.FC = () => {
  const {kf} = useT();
  const items: [IconName, number][] = [['house', -60], ['phone', 230], ['car', 1210], ['bank', 1500]];
  return (
    <World cam={{x: 720, y: 700, s: kf([[17.55, 1.6], [18.4, 1.5], [19.6, 0.84], [20.6, 0.8]])}}>
      <Spot x={720} bottom={640} />
      <Floor x1={-1200} x2={2600} />
      <Icon name="store" x={720} y={FLOOR - 140} s={3} sw={3.5} />
      {items.map(([n, x], i) => (
        <Pop key={n} at={w.beyond + 0.05 + i * 0.13} x={x} y={FLOOR - 110}>
          <Icon name={n} s={2.6} sw={3.5} />
        </Pop>
      ))}
    </World>
  );
};

/* S4 — monthly vs upfront */
export const S4: React.FC = () => {
  const {kf, p, t} = useT();
  const base = 800;
  const upH = 330;
  const blocks = range(12, w.monthly, 0.13);
  const line = p(w.upfront + 0.3, 0.4);
  return (
    <World cam={floorCam(570, kf([[20.5, 1.32], [24.1, 1.42]]))}>
      <Spot x={720} bottom={760} />
      <Floor />
      <Figure x={220} y={FLOOR} arms={t > w.bill ? pose.reachR : pose.idle} />
      <Pop at={w.bill - 0.05} x={720} y={300}><Icon name="bill" s={1.3} /></Pop>
      {/* monthly: 12 small payments stacking up */}
      {blocks.map((at, i) => {
        const above = (i + 1) * 34 > upH + 10;
        const lit = above && t > w.upfront + 0.5;
        return (
          <Drop key={i} at={at} x={560} y={base - i * 34} h={120} dur={0.2}>
            <rect x={-75} y={-30} width={150} height={30} rx={4} fill={lit ? c.white : c.fill2} stroke={c.line} strokeWidth={2.5} filter="url(#glow)" />
          </Drop>
        );
      })}
      <Pop at={w.monthly}><Label x={560} y={base + 44} text="MONTHLY" /></Pop>
      {/* upfront: one payment */}
      <Drop at={w.upfront - 0.05} x={880} y={base} h={160}>
        <rect x={-75} y={-upH} width={150} height={upH} rx={5} fill="url(#barFill)" stroke={c.line} strokeWidth={3} filter="url(#glow)" />
      </Drop>
      <Pop at={w.upfront}><Label x={880} y={base + 44} text="UPFRONT" /></Pop>
      <line x1={460} x2={460 + 520 * line} y1={base - upH} y2={base - upH} stroke={c.soft} strokeWidth={2} strokeDasharray="8 7" />
      <Halo x={560} y={base - 380} r={150} op={p(w.upfront + 0.5, 0.4)} />
      <line x1={420} x2={1020} y1={base} y2={base} stroke={c.line} strokeWidth={3} />
    </World>
  );
};

/* S5 — cheap product wears out, gets replaced */
export const S5: React.FC = () => {
  const {kf, p, t} = useT();
  const track = p(24.2, 0.6);
  const life = p(w.product, 27.9 - w.product, ease.linear);
  const cheap = [w.cheaper + 0.05, w.replacing, w.sooner];
  const dead = [w.wears + 0.2, w.sooner - 0.2, 999];
  return (
    <World cam={{x: 760, y: 600, s: kf([[24.1, 1.24], [28.2, 1.32]])}}>
      <Spot x={720} bottom={900} op={0.8} />
      {[430, 740].map((y) => (
        <line key={y} x1={300} x2={300 + 900 * track} y1={y} y2={y} stroke={c.dim} strokeWidth={2} strokeDasharray="10 9" />
      ))}
      {/* durable product: lasts the whole track */}
      <Pop at={w.product}><Icon name="shoe" x={360} y={390} s={1.3} /></Pop>
      <line x1={420} x2={420 + 760 * life} y1={430} y2={430} stroke={c.line} strokeWidth={4} filter="url(#glow)" opacity={t > w.product ? 1 : 0} />
      <Pop at={w.product + 0.15}><Coin x={360} y={490} r={22} /></Pop>
      {/* cheap product: wears out and is bought again */}
      {cheap.map((at, i) => {
        const x = 360 + i * 330;
        const gone = p(dead[i], 0.4);
        return (
          <g key={i}>
            <Pop at={at}><Icon name="shoe" x={x} y={700} s={1.3} op={1 - gone * 0.75} /></Pop>
            <Pop at={dead[i]} x={x + 38} y={660}><Badge name="cross" x={0} y={0} r={18} filled /></Pop>
            <Pop at={at + 0.12}><Coin x={x} y={800} r={16} /></Pop>
          </g>
        );
      })}
    </World>
  );
};

/* S6 — unexpected expense, no savings, high-interest borrowing */
export const S6: React.FC = () => {
  const {kf, p, t} = useT();
  const hit = w.expense + 0.35;
  const fly = (i: number) => {
    const k = p(w.borrow + i * 0.15, 0.5, ease.inOut);
    return {x: 1150 + (590 - 1150) * k, y: FLOOR - 140 - Math.sin(k * Math.PI) * 160, op: k > 0 && k < 1 ? 1 : 0};
  };
  return (
    <World cam={floorCam(660, kf([[28.15, 1.17], [34.8, 1.22]]))}>
      <Spot x={500} />
      <Spot x={1150} op={p(w.borrow - 0.4, 0.5)} />
      <Floor />
      <Figure x={470} arms={t > hit ? pose.shrug : pose.idle} lean={t > hit ? -4 * (1 - p(hit + 0.4, 0.6)) : 0} />
      <Drop at={w.expense} x={720} y={FLOOR - 70} h={700} dur={0.35}>
        <Icon name="bill" s={2.1} sw={3.6} />
        <Badge name="warning" x={34} y={-74} r={24} filled />
      </Drop>
      <Pop at={w.savings - 0.05}><Jar x={180} fill={0} dashed /></Pop>
      <Pop at={w.savings + 0.3}><Badge name="cross" x={220} y={FLOOR - 160} r={18} filled /></Pop>
      <Pop at={w.borrow - 0.35} x={1150} y={FLOOR - 70}><Icon name="bank" s={2.2} sw={3.5} /></Pop>
      {[0, 1, 2].map((i) => {
        const f = fly(i);
        return <g key={i} opacity={f.op}><Coin x={f.x} y={f.y} r={18} /></g>;
      })}
      <Pop at={w.interest - 0.1}><Badge name="percent" x={1150} y={FLOOR - 230} r={30} filled /></Pop>
      <CoinStack x={320} times={range(14, w.high, 0.07)} hl={w.rate} hlFrom={5} w={64} />
    </World>
  );
};

/* S7 — the poverty premium */
export const S7: React.FC = () => {
  const {kf, p, t} = useT();
  const baseH = 300;
  const g = p(w.extra - 0.1, 0.5);
  const ex = p(w.costs2, 0.5);
  return (
    <>
      <World cam={floorCam(720, kf([[34.75, 1.12], [42.9, 1.06]]))}>
        <Spot x={340} op={p(w.people, 0.5)} />
        <Spot x={1100} op={p(w.people, 0.5)} />
        <Floor />
        {/* cost columns: same base, one carries the extra */}
        {[640, 800].map((x, i) => (
          <rect key={x} x={x - 58} y={FLOOR - baseH * g} width={116} height={baseH * g} rx={4} fill={c.fill2} stroke={c.line} strokeWidth={3} filter="url(#glow)" opacity={g > 0 ? 1 : 0} />
        ))}
        <Halo x={800} y={FLOOR - baseH - 60} r={130} op={ex} />
        {ex > 0 && <rect x={742} y={FLOOR - baseH - 130 * ex} width={116} height={130 * ex} rx={4} fill={c.white} stroke={c.line} strokeWidth={3} filter="url(#glow)" />}
        <Pop at={w.people}><Figure x={340} /></Pop>
        <Pop at={w.people + 0.15}><Figure x={1100} arms={t > w.money ? pose.slump : pose.idle} /></Pop>
        <CoinStack x={480} times={range(8, w.enough, 0.05)} />
        <CoinStack x={960} times={range(2, w.money, 0.1)} />
        {/* cheaper options, reachable for one, locked for the other */}
        {(['pack', 'bill', 'shoe'] as IconName[]).map((n, i) => (
          <Pop key={n} at={w.access + i * 0.14} x={600 + i * 120} y={385}>
            <rect x={-46} y={-40} width={92} height={80} rx={10} fill={c.fill} stroke={c.soft} strokeWidth={2} />
            <Icon name={n} s={0.75} />
          </Pop>
        ))}
        <Pop at={w.options - 0.05}><Badge name="check" x={340} y={FLOOR - 255} r={24} /></Pop>
        <Pop at={w.options + 0.1}><Badge name="lock" x={1100} y={FLOOR - 255} r={26} filled /></Pop>
      </World>
      <Title text="POVERTY PREMIUM" at={w.poverty - 0.05} y={120} />
    </>
  );
};

/* S8 — money buys choices; when money is tight they disappear */
export const S8: React.FC = () => {
  const {kf, p, t} = useT();
  const cx = 720;
  const cy = 430;
  const things: IconName[] = ['milk', 'bread', 'can', 'shoe'];
  const thingsOut = p(w.buys2 - 0.1, 0.35);
  const nodes: {x: number; y: number; icon: IconName; at: number}[] = [
    {x: 330, y: 790, icon: 'pack', at: w.bulk},
    {x: 590, y: 820, icon: 'tag', at: w.sale},
    {x: 850, y: 820, icon: 'bill', at: w.upfront2},
    {x: 1110, y: 790, icon: 'shield', at: w.emergency},
  ];
  const squeeze = p(w.tight - 0.05, 0.4, ease.pop);
  const vanish = (i: number) => p(w.choices2 + 0.15 + (3 - i) * 0.24, 0.4, ease.in);
  return (
    <World cam={{x: 720, y: 600, s: kf([[42.85, 1.14], [52.4, 1.06], [55.9, 1.12]])}}>
      <Spot x={cx} top={160} bottom={560} />
      <Halo x={cx} y={cy} r={260} op={0.6 - squeeze * 0.4} />
      {things.map((n, i) => {
        const a = (-150 + i * 100) * (Math.PI / 180);
        return (
          <g key={n} opacity={1 - thingsOut}>
            <Pop at={w.things - 0.15 + i * 0.08} x={cx + Math.cos(a) * 230} y={cy + Math.sin(a) * 230}><Icon name={n} s={0.9} /></Pop>
          </g>
        );
      })}
      {nodes.map((n, i) => {
        const draw = p(w.choices + i * 0.08, 0.6);
        const v = vanish(i);
        const filled = t > n.at;
        const d = `M${cx} ${cy + 100} C${cx} ${cy + 260} ${n.x} ${n.y - 220} ${n.x} ${n.y - 60}`;
        return (
          <g key={i} opacity={1 - v}>
            <path d={d} fill="none" stroke={filled ? c.line : c.soft} strokeWidth={3} strokeDasharray="1200" strokeDashoffset={1200 * (1 - draw)} filter={filled ? 'url(#glow)' : undefined} />
            {draw > 0.9 && (
              <g transform={`translate(${n.x} ${n.y}) scale(${1 - v * 0.5})`}>
                <circle r={56} fill={c.fill} stroke={filled ? c.line : c.soft} strokeWidth={3} strokeDasharray={filled ? undefined : '8 8'} filter={filled ? 'url(#glow)' : undefined} />
                <Pop at={n.at}><Icon name={n.icon} s={0.8} /></Pop>
              </g>
            )}
          </g>
        );
      })}
      <g transform={`translate(${cx} ${cy}) scale(${1 - squeeze * 0.28} ${1 - squeeze * 0.12})`} opacity={1 - squeeze * 0.35}>
        <Pop at={42.9} from={0.6}><Coin r={92} filled /></Pop>
      </g>
    </World>
  );
};

/* S9 — less money, and paying more for what you need */
export const S9: React.FC = () => {
  const {kf, p, t} = useT();
  const end = p(w.need + 0.4, 0.8);
  return (
    <World cam={floorCam(720, kf([[55.85, 1.12], [63.4, 1.2]]))}>
      <Spot x={400} op={1 - end * 0.6} />
      <Spot x={1040} />
      <Floor />
      <g opacity={1 - end * 0.6}>
        <Figure x={310} arms={pose.holdR} />
        <CoinStack x={180} times={range(10, w.only, 0.06)} />
        <Basket x={490}><Groceries at={w.sometimes + 0.2} step={0.05} /></Basket>
        <CoinStack x={620} times={range(3, w.paying4, 0.1)} />
      </g>
      <Figure x={1130} arms={pose.hold} />
      <CoinStack x={1260} times={range(3, w.less2, 0.12)} />
      <Basket x={950}><Groceries at={w.sometimes + 0.3} step={0.05} /></Basket>
      <Halo x={820} y={FLOOR - 70} r={120} op={p(w.more3, 0.4)} />
      <CoinStack x={820} times={[...range(3, w.paying4, 0.1), w.more3, w.more3 + 0.1]} hl={w.more3} hlFrom={3} />
    </World>
  );
};
