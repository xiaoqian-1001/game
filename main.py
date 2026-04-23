from core.character import Character
from core.time_system import TimeSystem
from core.action import ActionSystem
from core.career import CareerSystem
from core.event import EventSystem
from core.save_load import SaveSystem
import config

def main():
    print("=" * 40)
    print("    欢迎来到 Python 命令行模拟人生")
    print("=" * 40)

    save = SaveSystem()
    saves = save.list_saves()

    if saves:
        print("\n已找到存档：")
        for i, s in enumerate(saves):
            print(f"{i+1}. {s}")
        choice = input("\n输入编号加载，或直接回车新建游戏：")
        if choice.strip():
            idx = int(choice)-1
            data = save.load(saves[idx])
            char = Character.from_dict(data)
        else:
            char = Character()
            char.create()
    else:
        char = Character()
        char.create()

    time_sys = TimeSystem()
    action_sys = ActionSystem()
    career_sys = CareerSystem()
    event_sys = EventSystem()

    while True:
        print("\n" + "-"*50)
        print(f"时间：{time_sys.get_date()} | 年龄：{char.age}")
        print(f"状态：饥饿={char.hunger} 精力={char.energy} 健康={char.health} 心情={char.mood}")
        print(f"属性：智力={char.intelligence} 魅力={char.charm} 体质={char.physique} 创造力={char.creativity}")
        print(f"金钱：{char.money} 元 | 职业：{char.career} Lv.{char.career_level}")
        print("-"*50)

        print("\n【可选行动】")
        print("1. 吃饭   2. 睡觉   3. 学习   4. 健身")
        print("5. 社交   6. 娱乐   7. 上班   8. 查看职业")
        print("9. 存档   0. 退出")

        choice = input("\n请选择行动：")

        if choice == "0":
            print("游戏退出！")
            break
        elif choice == "9":
            name = input("输入存档名称：")
            save.save(char.to_dict(), name)
            print("存档成功！")
            continue

        action_sys.do_action(choice, char, time_sys)
        time_sys.pass_hour()
        char.auto_decrease()
        char.check_death()
        event_sys.trigger_random_event(char)

if __name__ == "__main__":
    main()
