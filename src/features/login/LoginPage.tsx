import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui'
import { LangSwitch } from '@/app/Layout'
import { navigate, paths } from '@/lib/router'
import { t } from '@/lib/i18n'

// Demo entry screen. No real sign-in in v1: the button goes straight to the dashboard.

export function LoginPage() {
  return (
    <section className="grid min-h-screen grid-cols-[1.05fr_1fr] bg-white">
      <div className="relative flex flex-col justify-between overflow-hidden bg-[linear-gradient(145deg,#10243d,#1a3858)] p-[9%] text-white after:absolute after:right-[-170px] after:bottom-[-220px] after:h-[500px] after:w-[500px] after:rounded-full after:border-[70px] after:border-white/[0.03] after:content-['']">
        <span className="smallcaps text-[#f99d5f]">{t('Kromos Energy · Gestão de usinas')}</span>
        <div>
          <div className="inline-block rounded-[30px] border border-white/20 px-3.5 py-[9px] text-xs">●&nbsp;&nbsp; {t('Tudo em um só lugar')}</div>
          <h1 className="my-5 text-[clamp(40px,5vw,72px)] leading-[1.02] font-bold tracking-[-0.055em]">
            {t('Energia para')}<br />{t('ir mais longe')}<span className="text-[#fa8a48]">.</span>
          </h1>
          <p className="max-w-[460px] leading-[1.7] text-[#c3d0dc]">{t('Uma visão completa para acompanhar cada projeto, cada etapa e cada conquista.')}</p>
        </div>
        <span className="smallcaps text-[#8fa8ba]">{t('Uma plataforma pensada para você')}</span>
      </div>

      <div className="relative grid place-items-center p-[35px]">
        <LangSwitch className="absolute top-6 right-6" />
        <form
          className="w-[min(410px,100%)]"
          onSubmit={e => { e.preventDefault(); navigate(paths.overview()) }}
        >
          <Logo className="w-[190px] text-ink" />
          <h2 className="mt-[45px] mb-2.5 text-[31px] font-bold tracking-[-0.04em]">{t('Bem-vindo de volta.')}</h2>
          <p className="leading-relaxed text-muted">{t('Seu ponto de partida para acompanhar todas as suas usinas.')}</p>
          <div className="my-6 rounded-[10px] bg-[#fff6ed] p-[13px] text-xs text-[#9b5b29]">{t('Prévia de apresentação · Nenhuma senha é necessária.')}</div>
          <label className="mt-[18px] mb-2 block text-xs font-bold" htmlFor="login-email">{t('E-mail')}</label>
          <input id="login-email" className="field p-[13px] text-sm" placeholder={t('seu@email.com')} disabled />
          <label className="mt-[18px] mb-2 block text-xs font-bold" htmlFor="login-password">{t('Senha')}</label>
          <input id="login-password" className="field p-[13px] text-sm" placeholder="••••••••••" disabled />
          <Button type="submit" className="mt-6 w-full">{t('Entrar na demonstração')}&nbsp;&nbsp; →</Button>
          <p className="mt-6 text-[11px] text-muted">{t('Nesta prévia, o acesso e os dados são ilustrativos.')}</p>
        </form>
      </div>
    </section>
  )
}
