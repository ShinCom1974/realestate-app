// 物件一覧画面（ログイン後に表示される）
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import styles from './PropertiesPage.module.css'

// ダミーの物件データ
const DUMMY_PROPERTIES = [
  { id: 1, name: 'サンライズマンション 301号室', rent: 85000, area: '東京都新宿区西新宿', rooms: '1LDK', size: 42 },
  { id: 2, name: 'グリーンヒルズ 202号室', rent: 68000, area: '東京都渋谷区代々木', rooms: '1K', size: 28 },
  { id: 3, name: 'パークサイド南麻布 101号室', rent: 120000, area: '東京都港区南麻布', rooms: '2LDK', size: 65 },
  { id: 4, name: 'ラ・メゾン池袋 505号室', rent: 72000, area: '東京都豊島区池袋', rooms: '1LDK', size: 38 },
  { id: 5, name: 'コーポ吉祥寺 403号室', rent: 95000, area: '東京都武蔵野市吉祥寺', rooms: '2K', size: 50 },
  { id: 6, name: 'ブルーリバー川崎 201号室', rent: 58000, area: '神奈川県川崎市川崎区', rooms: '1K', size: 25 },
]

export default function PropertiesPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className={styles.page}>
      {/* ヘッダー */}
      <header className={styles.header}>
        <h1 className={styles.logo}>不動産管理システム</h1>
        <div className={styles.userInfo}>
          <span className={styles.email}>{user?.email}</span>
          <button className={styles.logoutButton} onClick={handleSignOut}>
            ログアウト
          </button>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className={styles.main}>
        <h2 className={styles.sectionTitle}>物件一覧</h2>
        <p className={styles.count}>{DUMMY_PROPERTIES.length} 件の物件</p>
        <div className={styles.grid}>
          {DUMMY_PROPERTIES.map((property) => (
            <div key={property.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.rooms}>{property.rooms}</span>
                <span className={styles.size}>{property.size}㎡</span>
              </div>
              <h3 className={styles.propertyName}>{property.name}</h3>
              <p className={styles.area}>
                <span className={styles.areaIcon}>📍</span>
                {property.area}
              </p>
              <p className={styles.rent}>
                <span className={styles.rentAmount}>
                  ¥{property.rent.toLocaleString()}
                </span>
                <span className={styles.rentUnit}> / 月</span>
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
