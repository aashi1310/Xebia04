import java.util.HashMap;
import java.util.Scanner;
public class LongestSubstring {
    public static int longestSubstring(String str) {
        HashMap<Character, Integer> map = new HashMap<>();
        int start = 0;
        int max = 0;
        for (int i = 0; i < str.length(); i++) {
            char ch = str.charAt(i);
            if (map.containsKey(ch) && map.get(ch) >= start) {
                start = map.get(ch) + 1;
            }
            map.put(ch, i);
            int len = i - start + 1;
            if (len > max) {
                max = len;
            }
        }
        return max;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter a string: ");
        String str = sc.nextLine();
        System.out.println("Length of longest substring = " + longestSubstring(str));
        sc.close();
    }
}
