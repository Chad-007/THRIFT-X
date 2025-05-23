public class RegexTest {
    public static void main(String[] args) {
        java.util.regex.Pattern p = java.util.regex.Pattern.compile("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$");
        String email = "test@example.com";
        System.out.println(p.matcher(email).matches());
    }
}
