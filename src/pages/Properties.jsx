import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// ダミーの物件データ
const DUMMY_PROPERTIES = [
  { id: 1, name: 'グランドメゾン渋谷', rent: 180000, area: '東京都渋谷区', rooms: '2LDK', age: '築3年' },
  { id: 2, name: 'パークハイム新宿', rent: 150000, area: '東京都新宿区', rooms: '1LDK', age: '築7年' },
  { id: 3, name: 'コスモシティ横浜', rent: 120000, area: '神奈川県横浜市', rooms: '2DK', age: '築10年' },
  { id: 4, name: 'サンライズ大阪', rent: 95000, area: '大阪府大阪市', rooms: '1K', age: '築5年' },
  { id: 5, name: 'ブルースカイ池袋', rent: 135000, area: '東京都豊島区', rooms: '1LDK', age: '築2年' },
  { id: 6, name: 'リバーサイド川崎', rent: 108000, area: '神奈川県川崎市', rooms: '2DK', age: '築15年' },
]

export default function Properties() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="properties-wrapper">
      {/* ヘッダー */}
      <header className="properties-header">
        <h1 className="site-title">不動産管理システム</h1>
        <div className="header-right">
          <span className="user-email">{user?.email}</span>
          <button onClick={handleSignOut} className="btn-logout">
            ログアウト
          </button>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="properties-main">
        <h2 className="section-title">物件一覧</h2>
        <p className="property-count">全 {DUMMY_PROPERTIES.length} 件</p>
        <div className="property-grid">
          {DUMMY_PROPERTIES.map((property) => (
            <div key={property.id} className="property-card">
              <div className="property-card-header">
                <h3 className="property-name">{property.name}</h3>
                <span className="property-age">{property.age}</span>
              </div>
              <div className="property-card-body">
                <p className="property-rent">
                  <span className="rent-label">家賃</span>
                  <span className="rent-value">
                    {property.rent.toLocaleString()}
                    <span className="rent-unit">円 / 月</span>
                  </span>
                </p>
                <p className="property-detail">
                  <span className="detail-label">エリア</span>
                  <span>{property.area}</span>
                </p>
                <p className="property-detail">
                  <span className="detail-label">間取り</span>
                  <span>{property.rooms}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
