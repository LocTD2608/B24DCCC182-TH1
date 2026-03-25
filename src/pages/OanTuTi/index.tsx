import React, { useState } from 'react';
import { Card, Button, Typography, Space, Tag, Divider, Row, Col, Statistic, Badge } from 'antd';
import { TrophyOutlined, ReloadOutlined, HistoryOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

type Choice = 'Kéo' | 'Búa' | 'Bao';
type Result = 'Thắng' | 'Thua' | 'Hòa';

interface GameRecord {
    round: number;
    playerChoice: Choice;
    computerChoice: Choice;
    result: Result;
}

const CHOICES: Choice[] = ['Kéo', 'Búa', 'Bao'];

const EMOJI: Record<Choice, string> = {
    Kéo: '✂️',
    Búa: '🪨',
    Bao: '📄',
};

// Standard: Rock beats Scissors, Scissors beats Paper, Paper beats Rock
// Búa = Rock, Kéo = Scissors, Bao = Paper
// Búa thắng Kéo, Kéo thắng Bao, Bao thắng Búa
const PLAYER_WINS_AGAINST: Record<Choice, Choice> = {
    Búa: 'Kéo',
    Kéo: 'Bao',
    Bao: 'Búa',
};

const getResult = (player: Choice, computer: Choice): Result => {
    if (player === computer) return 'Hòa';
    if (PLAYER_WINS_AGAINST[player] === computer) return 'Thắng';
    return 'Thua';
};

const getResultColor = (result: Result): string => {
    if (result === 'Thắng') return '#52c41a';
    if (result === 'Thua') return '#ff4d4f';
    return '#faad14';
};

const getResultTag = (result: Result) => {
    const colorMap: Record<Result, 'success' | 'error' | 'warning'> = {
        Thắng: 'success',
        Thua: 'error',
        Hòa: 'warning',
    };
    return <Tag color={colorMap[result]}>{result}</Tag>;
};

const OanTuTi: React.FC = () => {
    const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
    const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
    const [result, setResult] = useState<Result | null>(null);
    const [history, setHistory] = useState<GameRecord[]>([]);
    const [round, setRound] = useState(1);
    const [isAnimating, setIsAnimating] = useState(false);

    const wins = history.filter(h => h.result === 'Thắng').length;
    const losses = history.filter(h => h.result === 'Thua').length;
    const draws = history.filter(h => h.result === 'Hòa').length;

    const handlePlay = (choice: Choice) => {
        if (isAnimating) return;
        setIsAnimating(true);

        // Animate computer thinking
        let count = 0;
        const interval = setInterval(() => {
            const randomChoice = CHOICES[Math.floor(Math.random() * CHOICES.length)];
            setComputerChoice(randomChoice);
            count++;
            if (count >= 8) {
                clearInterval(interval);
                const finalComputer = CHOICES[Math.floor(Math.random() * CHOICES.length)];
                setComputerChoice(finalComputer);
                setPlayerChoice(choice);
                const gameResult = getResult(choice, finalComputer);
                setResult(gameResult);
                const record: GameRecord = {
                    round,
                    playerChoice: choice,
                    computerChoice: finalComputer,
                    result: gameResult,
                };
                setHistory(prev => [record, ...prev]);
                setRound(prev => prev + 1);
                setIsAnimating(false);
            }
        }, 80);

        setPlayerChoice(choice);
    };

    const handleReset = () => {
        setPlayerChoice(null);
        setComputerChoice(null);
        setResult(null);
        setHistory([]);
        setRound(1);
    };

    return (
        <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
            <Card>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <div style={{ textAlign: 'center' }}>
                        <Title level={2}>✊ Oẳn Tù Tì</Title>
                        <Text type="secondary">Chọn Kéo, Búa hoặc Bao để bắt đầu!</Text>
                    </div>

                    {/* Thống kê */}
                    <Row gutter={16} justify="center">
                        <Col span={6}>
                            <Card size="small" style={{ textAlign: 'center', background: '#f6ffed', borderColor: '#b7eb8f' }}>
                                <Statistic title="Thắng" value={wins} valueStyle={{ color: '#52c41a' }} prefix={<TrophyOutlined />} />
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card size="small" style={{ textAlign: 'center', background: '#fff2f0', borderColor: '#ffccc7' }}>
                                <Statistic title="Thua" value={losses} valueStyle={{ color: '#ff4d4f' }} />
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card size="small" style={{ textAlign: 'center', background: '#fffbe6', borderColor: '#ffe58f' }}>
                                <Statistic title="Hòa" value={draws} valueStyle={{ color: '#faad14' }} />
                            </Card>
                        </Col>
                    </Row>

                    {/* Khu vực chơi */}
                    <Card
                        style={{
                            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                            borderRadius: 12,
                            minHeight: 160,
                        }}
                    >
                        <Row align="middle" justify="space-around" style={{ minHeight: 120 }}>
                            <Col style={{ textAlign: 'center' }}>
                                <Text strong style={{ fontSize: 14, color: '#666' }}>Bạn</Text>
                                <div style={{ fontSize: 64, marginTop: 8 }}>
                                    {playerChoice ? EMOJI[playerChoice] : '❓'}
                                </div>
                                {playerChoice && <Text strong style={{ fontSize: 16 }}>{playerChoice}</Text>}
                            </Col>
                            <Col style={{ textAlign: 'center' }}>
                                {result ? (
                                    <div>
                                        <div style={{ fontSize: 28, fontWeight: 'bold', color: getResultColor(result) }}>
                                            {result === 'Thắng' ? '🎉 Bạn Thắng!' : result === 'Thua' ? '😢 Bạn Thua!' : '🤝 Hòa!'}
                                        </div>
                                        <Badge count={`Ván ${round - 1}`} color="#1677ff" style={{ marginTop: 8 }} />
                                    </div>
                                ) : (
                                    <Text type="secondary" style={{ fontSize: 24 }}>VS</Text>
                                )}
                            </Col>
                            <Col style={{ textAlign: 'center' }}>
                                <Text strong style={{ fontSize: 14, color: '#666' }}>Máy tính</Text>
                                <div style={{ fontSize: 64, marginTop: 8 }}>
                                    {computerChoice ? EMOJI[computerChoice] : '🤖'}
                                </div>
                                {computerChoice && <Text strong style={{ fontSize: 16 }}>{computerChoice}</Text>}
                            </Col>
                        </Row>
                    </Card>

                    {/* Nút chọn */}
                    <div style={{ textAlign: 'center' }}>
                        <Text strong style={{ display: 'block', marginBottom: 12, fontSize: 15 }}>
                            Chọn của bạn:
                        </Text>
                        <Space size="large">
                            {CHOICES.map(choice => (
                                <Button
                                    key={choice}
                                    size="large"
                                    onClick={() => handlePlay(choice)}
                                    disabled={isAnimating}
                                    style={{
                                        height: 80,
                                        width: 100,
                                        fontSize: 14,
                                        fontWeight: 'bold',
                                        borderRadius: 12,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 4,
                                        border: playerChoice === choice && !isAnimating ? '2px solid #1677ff' : undefined,
                                    }}
                                >
                                    <span style={{ fontSize: 28 }}>{EMOJI[choice]}</span>
                                    <span>{choice}</span>
                                </Button>
                            ))}
                        </Space>
                    </div>

                    {history.length > 0 && (
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={handleReset}
                            block
                        >
                            Đặt lại
                        </Button>
                    )}

                    {/* Lịch sử */}
                    {history.length > 0 && (
                        <>
                            <Divider>
                                <Space>
                                    <HistoryOutlined />
                                    <span>Lịch sử ({history.length} ván)</span>
                                </Space>
                            </Divider>
                            <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                                {history.map((record) => (
                                    <Card
                                        key={record.round}
                                        size="small"
                                        style={{ marginBottom: 8, borderLeft: `4px solid ${getResultColor(record.result)}` }}
                                    >
                                        <Row justify="space-between" align="middle">
                                            <Col>
                                                <Text type="secondary">Ván {record.round}</Text>
                                            </Col>
                                            <Col style={{ textAlign: 'center' }}>
                                                <Space>
                                                    <span>{EMOJI[record.playerChoice]} <strong>{record.playerChoice}</strong></span>
                                                    <Text type="secondary">vs</Text>
                                                    <span>{EMOJI[record.computerChoice]} <strong>{record.computerChoice}</strong></span>
                                                </Space>
                                            </Col>
                                            <Col>
                                                {getResultTag(record.result)}
                                            </Col>
                                        </Row>
                                    </Card>
                                ))}
                            </div>
                        </>
                    )}
                </Space>
            </Card>
        </div>
    );
};

export default OanTuTi;
