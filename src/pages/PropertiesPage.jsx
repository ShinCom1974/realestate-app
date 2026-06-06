// 物件一覧画面：Supabase からデータを取得し、CRUD 操作を行う
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { fetchProperties, createProperty, updateProperty, deleteProperty } from '../lib/propertiesApi'
import PropertyForm from '../components/PropertyForm'
import styles from './PropertiesPage.module.css'

export default function PropertiesPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  // 物件一覧データ
  const [properties, setProperties] = useState([])
  // データ取得中のローディング状態
  const [loading, setLoading] = useState(true)
  // エラーメッセージ
  const [fetchError, setFetchError] = useState('')

  // フォームの表示制御
  // null: 非表示、'new': 新規登録、property オブジェクト: 編集対象
  const [formMode, setFormMode] = useState(null)
  // フォームの保存処理中フラグ
  const [submitting, setSubmitting] = useState(false)

  // 削除確認ダイアログ用（削除対象の ID を保持）
  const [deletingId, setDeletingId] = useState(null)

  // 初回マウント時に物件一覧を取得
  useEffect(() => {
    loadProperties()
  }, [])

  const loadProperties = async () => {
    setLoading(true)
    setFetchError('')
    try {
      const data = await fetchProperties()
      setProperties(data)
    } catch {
      setFetchError('物件の取得に失敗しました。ページをリロードしてください。')
    } finally {
      setLoading(false)
    }
  }

  // ログアウト処理
  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  // 物件を新規登録する
  const handleCreate = async (formData) => {
    setSubmitting(true)
    try {
      const newProperty = await createProperty({ userId: user.id, ...formData })
      // 先頭に追加（降順で表示しているため）
      setProperties((prev) => [newProperty, ...prev])
      setFormMode(null)
    } finally {
      setSubmitting(false)
    }
  }

  // 物件を更新する
  const handleUpdate = async (formData) => {
    setSubmitting(true)
    try {
      const updated = await updateProperty(formMode.id, formData)
      setProperties((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
      setFormMode(null)
    } finally {
      setSubmitting(false)
    }
  }

  // 物件を削除する（確認ダイアログで OK を押した後に実行）
  const handleDelete = async (id) => {
    try {
      await deleteProperty(id)
      setProperties((prev) => prev.filter((p) => p.id !== id))
    } catch {
      alert('削除に失敗しました。もう一度お試しください。')
    } finally {
      setDeletingId(null)
    }
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
        <div className={styles.titleRow}>
          <div>
            <h2 className={styles.sectionTitle}>物件一覧</h2>
            {!loading && (
              <p className={styles.count}>{properties.length} 件の物件</p>
            )}
          </div>
          {/* 新規登録ボタン */}
          <button className={styles.addButton} onClick={() => setFormMode('new')}>
            ＋ 物件を登録
          </button>
        </div>

        {/* データ取得エラー */}
        {fetchError && <p className={styles.errorBanner}>{fetchError}</p>}

        {/* ローディング */}
        {loading && <p className={styles.loadingText}>読み込み中...</p>}

        {/* 物件ゼロ件 */}
        {!loading && !fetchError && properties.length === 0 && (
          <div className={styles.empty}>
            <p>登録されている物件はありません。</p>
            <p>「＋ 物件を登録」ボタンから追加してください。</p>
          </div>
        )}

        {/* 物件カードグリッド */}
        {!loading && properties.length > 0 && (
          <div className={styles.grid}>
            {properties.map((property) => (
              <div key={property.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.layout}>{property.layout}</span>
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
                {/* 編集・削除ボタン */}
                <div className={styles.cardActions}>
                  <button
                    className={styles.editButton}
                    onClick={() => setFormMode(property)}
                  >
                    編集
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => setDeletingId(property.id)}
                  >
                    削除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 新規登録 / 編集フォームモーダル */}
      {formMode !== null && (
        <PropertyForm
          property={formMode === 'new' ? null : formMode}
          onSubmit={formMode === 'new' ? handleCreate : handleUpdate}
          onCancel={() => setFormMode(null)}
          submitting={submitting}
        />
      )}

      {/* 削除確認ダイアログ */}
      {deletingId !== null && (
        <div className={styles.confirmOverlay} onClick={() => setDeletingId(null)}>
          <div className={styles.confirmDialog} onClick={(e) => e.stopPropagation()}>
            <p className={styles.confirmText}>この物件を削除しますか？</p>
            <p className={styles.confirmSub}>この操作は取り消せません。</p>
            <div className={styles.confirmActions}>
              <button className={styles.confirmCancel} onClick={() => setDeletingId(null)}>
                キャンセル
              </button>
              <button className={styles.confirmDelete} onClick={() => handleDelete(deletingId)}>
                削除する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
