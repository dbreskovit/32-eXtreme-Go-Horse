import { useNavigate } from 'react-router-dom'
import { PLANOS } from '../../mocks/data'

export function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-green-700">🌾 FluxoGrão</span>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-sm text-green-700 font-medium hover:bg-green-50 rounded-lg transition-colors"
            >
              Entrar
            </button>
            <button
              onClick={() => navigate('/cadastro')}
              className="px-4 py-2 text-sm bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Começar grátis
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-28 pb-20 px-6 bg-gradient-to-br from-green-50 to-amber-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-6">
            Code Race 2026 · Agronegócio Inteligente
          </div>
          <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
            Diga adeus às filas de<br />
            <span className="text-green-600">caminhões no silo</span>
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
            FluxoGrão traz o sistema de agendamento por janela horária dos grandes portos
            direto para cooperativas e silos do interior.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => navigate('/cadastro')}
              className="px-8 py-3.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
            >
              Começar gratuitamente
            </button>
            <button
              onClick={() => navigate('/login?tab=motorista')}
              className="px-8 py-3.5 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              🚛 Sou motorista
            </button>
          </div>
        </div>
      </section>

      {/* Problema */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">O problema é real</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '⛽', num: '+20%', label: 'de custo de frete no pico da safra por falta de organização' },
              { icon: '⏱️', num: '8h+', label: 'de espera média dos caminhões em filas em períodos de pico' },
              { icon: '🌱', num: '1,2 bi L', label: 'de diesel extras gastos em 2025 por rodovias e logística ineficiente' },
            ].map(card => (
              <div key={card.num} className="text-center p-8 rounded-2xl bg-red-50 border border-red-100">
                <div className="text-4xl mb-3">{card.icon}</div>
                <div className="text-4xl font-bold text-red-600 mb-2">{card.num}</div>
                <p className="text-gray-600 text-sm leading-relaxed">{card.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-20 px-6 bg-green-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Como funciona</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '1', icon: '🏢', title: 'Cadastre suas docas', desc: 'Configure capacidade e horários de cada ponto de descarga' },
              { step: '2', icon: '📅', title: 'Motorista agenda', desc: 'Escolhe doca, data e horário disponível pelo celular em segundos' },
              { step: '3', icon: '📲', title: 'QR Code na guarita', desc: 'Operador bipa o QR e o sistema direciona o caminhão' },
              { step: '4', icon: '📊', title: 'Analytics em tempo real', desc: 'Painel com fluxo por hora, previsões e relatório de CO₂' },
            ].map(item => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Planos */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Planos simples e transparentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PLANOS.map((plano, i) => (
              <div
                key={plano.id}
                className={`rounded-2xl p-8 border-2 ${
                  i === 1
                    ? 'border-green-500 shadow-xl shadow-green-100'
                    : 'border-gray-100'
                }`}
              >
                {i === 1 && (
                  <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full mb-4">
                    Mais popular
                  </span>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plano.nome}</h3>
                <div className="mb-4">
                  {plano.precoMensal === 0 ? (
                    <span className="text-4xl font-bold text-gray-900">Grátis</span>
                  ) : plano.precoMensal === -1 ? (
                    <span className="text-2xl font-bold text-gray-900">Sob consulta</span>
                  ) : (
                    <span className="text-4xl font-bold text-gray-900">
                      R$ {plano.precoMensal.toLocaleString('pt-BR')}
                      <span className="text-base font-normal text-gray-400">/mês</span>
                    </span>
                  )}
                </div>
                <p className="text-gray-500 text-sm mb-6">{plano.descricao}</p>
                <button
                  onClick={() => navigate('/cadastro')}
                  className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                    i === 1
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {plano.precoMensal === -1 ? 'Falar com vendas' : 'Começar agora'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-100 text-center text-gray-400 text-sm">
        <strong className="text-gray-600">FluxoGrão</strong> — Organizando o fluxo, acelerando o agro.
        <br />Code Race 2026 · Antonio Meneghetti Faculdade
      </footer>
    </div>
  )
}
