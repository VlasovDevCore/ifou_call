import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// Страница короткой ссылки https://ifou.ru/<код> (и старых /u/<ник>, /c/<ссылка>):
// аватарка и имя пользователя или канала, «Открыть в IFOU» и «Скачать».
// Данные - api/handle.php (прокси к бэкенду мессенджера). Цвета - палитра
// приложения (AppPalette в lib/core/theme/app_colors.dart), шрифт Onest.

type UserCard = { nickname: string; name: string | null; avatarUrl: string | null };
type ChannelCard = {
  slug: string;
  title: string | null;
  description: string | null;
  avatarUrl: string | null;
  isPrivate: boolean;
  memberCount: number;
};
type State =
  | { status: 'loading' }
  | { status: 'notFound' }
  | { status: 'error' }
  | { status: 'user'; user: UserCard }
  | { status: 'channel'; channel: ChannelCard };

const ANDROID_PACKAGE = 'com.ifou.app';
const CODE_RE = /^[a-zA-Z0-9_]{3,50}$/;

// Цвет заглушки аватара - как в приложении, по первому символу.
const AVATAR_COLORS = ['#6F43F8', '#906CFF', '#E0539B', '#F2994A', '#27AE60', '#2D9CDB', '#EB5757', '#9B51E0'];

function plural(n: number, one: string, few: string, many: string): string {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '').replace('.', ',')} млн`;
  if (n >= 10_000) return `${Math.floor(n / 1000)} тыс.`;
  return n.toLocaleString('ru-RU');
}

function initials(text: string): string {
  const parts = text.trim().split(/\s+/).filter(Boolean);
  const s = parts.length > 1 ? parts[0][0] + parts[1][0] : (parts[0] ?? '?').slice(0, 2);
  return s.toUpperCase();
}

function Avatar({ url, label }: { url: string | null; label: string }) {
  const [broken, setBroken] = useState(false);
  const color = AVATAR_COLORS[(label.codePointAt(0) ?? 0) % AVATAR_COLORS.length];
  if (url && !broken) {
    return (
      <img
        src={url}
        alt=""
        onError={() => setBroken(true)}
        className="h-[112px] w-[112px] rounded-full object-cover"
        style={{ background: 'var(--l-field)' }}
      />
    );
  }
  return (
    <div
      className="flex h-[112px] w-[112px] items-center justify-center rounded-full text-[38px] font-semibold text-white"
      style={{ background: color }}
    >
      {initials(label)}
    </div>
  );
}

export default function LinkPage() {
  const params = useParams();
  const code = params.code ?? '';
  const [state, setState] = useState<State>({ status: 'loading' });

  useEffect(() => {
    if (!CODE_RE.test(code)) {
      setState({ status: 'notFound' });
      return;
    }
    const ctrl = new AbortController();
    setState({ status: 'loading' });
    fetch(`/api/handle.php?code=${encodeURIComponent(code)}`, { signal: ctrl.signal })
      .then(async (r) => {
        if (r.status === 404) return setState({ status: 'notFound' });
        if (!r.ok) return setState({ status: 'error' });
        const data = await r.json();
        if (data.kind === 'user' && data.user) setState({ status: 'user', user: data.user });
        else if (data.kind === 'channel' && data.channel) setState({ status: 'channel', channel: data.channel });
        else setState({ status: 'notFound' });
      })
      .catch((e) => {
        if (e?.name !== 'AbortError') setState({ status: 'error' });
      });
    return () => ctrl.abort();
  }, [code]);

  useEffect(() => {
    const title =
      state.status === 'user'
        ? `${state.user.name || state.user.nickname} (@${state.user.nickname}) — IFOU`
        : state.status === 'channel'
          ? `${state.channel.title || 'Канал'} — IFOU`
          : 'IFOU';
    document.title = title;
  }, [state]);

  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const isAndroid = /Android/i.test(ua);
  const isMobile = isAndroid || /iPhone|iPad|iPod/i.test(ua);

  // Старая форма ссылки (/u/, /c/) - её понимают и прежние версии приложения.
  const appPath =
    state.status === 'user'
      ? `/u/${state.user.nickname}`
      : state.status === 'channel'
        ? `/c/${state.channel.slug}`
        : null;
  const downloadUrl = '/app';
  const openUrl = appPath
    ? isAndroid
      ? `intent://ifou.ru${appPath}#Intent;scheme=https;package=${ANDROID_PACKAGE};` +
        `S.browser_fallback_url=${encodeURIComponent(`https://ifou.ru${downloadUrl}`)};end`
      : `https://ifou.ru${appPath}`
    : null;

  return (
    <div className="ifou-link flex min-h-screen flex-col items-center px-4 py-8">
      <style>{`
        .ifou-link {
          --l-bg: #F0F0F5; --l-surface: #FFFFFF; --l-field: #F0F0F5; --l-divider: #EAE8F0;
          --l-text: #13141D; --l-subtitle: #5A5A5E; --l-grey: #9A9AA6;
          --l-accent: #6F43F8; --l-accent-light: #EDE8FF;
          background: var(--l-bg); color: var(--l-text);
          font-family: 'Onest', 'Inter', system-ui, sans-serif;
        }
        @media (prefers-color-scheme: dark) {
          .ifou-link {
            --l-bg: #171717; --l-surface: #212121; --l-field: #2B2B2B; --l-divider: #303030;
            --l-text: #EDEDED; --l-subtitle: #A3A3A3; --l-grey: #737373;
            --l-accent: #7C5CFC; --l-accent-light: #2A2638;
          }
        }
        @keyframes ifou-ghost { 0%, 100% { opacity: .55 } 50% { opacity: 1 } }
        .ifou-ghost { background: var(--l-field); animation: ifou-ghost 1.4s ease-in-out infinite; }
      `}</style>

      <a href="/" className="mb-8 flex items-center gap-2">
<img
  src="/assets/ifou-logo.svg"
  alt="IFOU"
  className="h-9 w-9 rounded-[10px] bg-white object-contain p-1.5"
/>

<span className="text-[20px] font-bold tracking-[-0.3px]">IFOU</span>
      </a>

      <main
        className="w-full max-w-[400px] rounded-[24px] px-6 pb-6 pt-8 text-center"
        style={{ background: 'var(--l-surface)', boxShadow: '0 8px 32px rgba(19, 20, 29, 0.06)' }}
      >
        {state.status === 'loading' && (
          <div className="flex flex-col items-center" aria-busy="true">
            <div className="ifou-ghost h-[112px] w-[112px] rounded-full" />
            <div className="ifou-ghost mt-5 h-[24px] w-[180px] rounded-[8px]" />
            <div className="ifou-ghost mt-3 h-[16px] w-[120px] rounded-[6px]" />
            <div className="ifou-ghost mt-8 h-[52px] w-full rounded-[14px]" />
            <div className="ifou-ghost mt-3 h-[52px] w-full rounded-[14px]" />
          </div>
        )}

        {state.status === 'user' && (
          <div className="flex flex-col items-center">
            <Avatar url={state.user.avatarUrl} label={state.user.name || state.user.nickname} />
            <h1 className="mt-5 break-words text-[24px] font-semibold leading-[30px]">
              {state.user.name || state.user.nickname}
            </h1>
            <p className="mt-1 text-[15px]" style={{ color: 'var(--l-subtitle)' }}>
              @{state.user.nickname}
            </p>
          </div>
        )}

        {state.status === 'channel' && (
          <div className="flex flex-col items-center">
            <Avatar url={state.channel.avatarUrl} label={state.channel.title || state.channel.slug} />
            <h1 className="mt-5 break-words text-[24px] font-semibold leading-[30px]">
              {state.channel.title || 'Канал'}
            </h1>
            <p className="mt-1 text-[15px]" style={{ color: 'var(--l-subtitle)' }}>
              {state.channel.isPrivate ? 'Частный канал' : 'Канал'} ·{' '}
              {formatCount(state.channel.memberCount)}{' '}
              {plural(state.channel.memberCount, 'подписчик', 'подписчика', 'подписчиков')}
            </p>
            {state.channel.description && (
              <p
                className="mt-4 whitespace-pre-line break-words text-[15px] leading-[21px]"
                style={{ color: 'var(--l-text)' }}
              >
                {state.channel.description}
              </p>
            )}
          </div>
        )}

        {(state.status === 'notFound' || state.status === 'error') && (
          <div className="flex flex-col items-center">
            <div
              className="flex h-[112px] w-[112px] items-center justify-center rounded-full"
              style={{ background: 'var(--l-accent-light)', color: 'var(--l-accent)' }}
            >
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
            </div>
            <h1 className="mt-5 text-[22px] font-semibold leading-[28px]">
              {state.status === 'notFound' ? 'Ничего не найдено' : 'Не удалось загрузить'}
            </h1>
            <p className="mt-2 text-[15px] leading-[21px]" style={{ color: 'var(--l-subtitle)' }}>
              {state.status === 'notFound'
                ? `Пользователя или канала «${code}» в IFOU нет.`
                : 'Проверьте подключение и обновите страницу.'}
            </p>
          </div>
        )}

        {state.status !== 'loading' && (
          <div className="mt-8 flex flex-col gap-3">
            {openUrl && isMobile && (
              <a
                href={openUrl}
                className="flex h-[52px] items-center justify-center rounded-[14px] text-[16px] font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: 'var(--l-accent)' }}
              >
                {state.status === 'channel' ? 'Открыть канал в IFOU' : 'Открыть в IFOU'}
              </a>
            )}
            <a
              href={downloadUrl}
              className="flex h-[52px] items-center justify-center rounded-[14px] text-[16px] font-semibold transition-opacity hover:opacity-90"
              style={
                openUrl && isMobile
                  ? { background: 'var(--l-accent-light)', color: 'var(--l-accent)' }
                  : { background: 'var(--l-accent)', color: '#FFFFFF' }
              }
            >
              Скачать IFOU
            </a>
            {openUrl && !isMobile && (
              <p className="mt-1 text-[13px] leading-[18px]" style={{ color: 'var(--l-grey)' }}>
                Откройте эту ссылку на телефоне с установленным IFOU
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
