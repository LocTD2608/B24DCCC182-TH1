const CLUBS_KEY = 'quanLyCLB_clubs';
const MEMBERS_KEY = 'quanLyCLB_members';

/** Lấy danh sách CLB */
export const getClubs = (): QuanLyCLB.Club[] => {
    return JSON.parse(localStorage.getItem(CLUBS_KEY) || '[]');
};

/** Lấy tất cả thành viên */
export const getAllMembers = (): QuanLyCLB.Member[] => {
    return JSON.parse(localStorage.getItem(MEMBERS_KEY) || '[]');
};

/** Lấy thành viên Approved theo CLB */
export const getMembersByClub = (clubId: string): QuanLyCLB.Member[] => {
    const allMembers = getAllMembers();
    return allMembers.filter((m) => m.clubId === clubId && m.trangThai === 'Approved');
};

/** Chuyển CLB cho nhiều thành viên cùng lúc */
export const changeClub = (memberIds: string[], newClubId: string): void => {
    const allMembers = getAllMembers();
    const updatedMembers = allMembers.map((m) => {
        if (memberIds.includes(m.id)) {
            return { ...m, clubId: newClubId };
        }
        return m;
    });
    localStorage.setItem(MEMBERS_KEY, JSON.stringify(updatedMembers));
};
