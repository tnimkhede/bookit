import { motion } from 'framer-motion';
import './StatsCard.css';

export default function StatsCard({ icon: Icon, title, value, subtitle, trend, gradient }) {
    return (
        <motion.div
            className="stats-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
            <div className={`stats-icon ${gradient}`}>
                <Icon />
            </div>
            <div className="stats-content">
                <h3 className="stats-title">{title}</h3>
                <p className="stats-value">{value}</p>
                {subtitle && <p className="stats-subtitle">{subtitle}</p>}
                {trend && (
                    <div className={`stats-trend ${trend > 0 ? 'positive' : 'negative'}`}>
                        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                    </div>
                )}
            </div>
        </motion.div>
    );
}
