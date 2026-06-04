import java.util.Scanner;
public class AnagramCheck {
    public static boolean isAnagram(String str1, String str2) {
        str1 = str1.toLowerCase().replace(" ", "");
        str2 = str2.toLowerCase().replace(" ", "");
        if (str1.length() != str2.length()) {
            return false;
        }
        int freq[] = new int[256];
        for (int i = 0; i < str1.length(); i++) {
            freq[str1.charAt(i)]++;
            freq[str2.charAt(i)]--;
        }
        for (int i = 0; i < 256; i++) {
            if (freq[i] != 0) {
                return false;
            }
        }
        return true;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter first string: ");
        String str1 = sc.nextLine();
        System.out.print("Enter second string: ");
        String str2 = sc.nextLine();
        if (isAnagram(str1, str2)) {
            System.out.println("Anagram");
        } else {
            System.out.println("Not Anagram");
        }
        sc.close();
    }
}
