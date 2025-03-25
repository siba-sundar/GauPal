import java.awt.*;
import java.awt.event.*;

public class Exno8_GUI extends Frame {
    Label labelName = new Label("Name");
    TextField textFieldName = new TextField();
    Label labelSex = new Label("Sex");
    CheckboxGroup sexGroup = new CheckboxGroup();
    Checkbox maleCheckbox = new Checkbox("Male", sexGroup, false);
    Checkbox femaleCheckbox = new Checkbox("Female", sexGroup, false);
    Label labelEyeColor = new Label("Eye color");
    Choice eyeColorChoice = new Choice();
    Label labelCheckAll = new Label("Check all that apply");
    Checkbox tallCheckbox = new Checkbox("Over 6 feet tall");
    Checkbox weightCheckbox = new Checkbox("Over 200 pounds");
    Label labelAthleticAbility = new Label("Describe your athletic ability:");
    TextArea athleticAbilityTextArea = new TextArea();
    Button submitButton = new Button("Enter my information");

    Exno8_GUI() {
        this.setSize(500, 400);
        this.setTitle("Athletic Form");
        this.setLayout(null);

        labelName.setBounds(50, 50, 100, 25);
        textFieldName.setBounds(200, 50, 200, 25);
        labelSex.setBounds(50, 90, 100, 25);
        maleCheckbox.setBounds(200, 90, 60, 25);
        femaleCheckbox.setBounds(270, 90, 80, 25);
        labelEyeColor.setBounds(50, 130, 100, 25);
        eyeColorChoice.setBounds(200, 130, 100, 25);
        eyeColorChoice.add("Blue");
        eyeColorChoice.add("Green");
        eyeColorChoice.add("Brown");
        labelCheckAll.setBounds(50, 170, 150, 25);
        tallCheckbox.setBounds(200, 170, 150, 25);
        weightCheckbox.setBounds(200, 200, 150, 25);
        labelAthleticAbility.setBounds(50, 240, 200, 25);
        athleticAbilityTextArea.setBounds(50, 270, 350, 50);
        submitButton.setBounds(150, 330, 150, 30);

        this.add(labelName);
        this.add(textFieldName);
        this.add(labelSex);
        this.add(maleCheckbox);
        this.add(femaleCheckbox);
        this.add(labelEyeColor);
        this.add(eyeColorChoice);
        this.add(labelCheckAll);
        this.add(tallCheckbox);
        this.add(weightCheckbox);
        this.add(labelAthleticAbility);
        this.add(athleticAbilityTextArea);
        this.add(submitButton);

        this.setVisible(true);

        submitButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                String name = textFieldName.getText().trim();
                String sex = sexGroup.getSelectedCheckbox() != null ? sexGroup.getSelectedCheckbox().getLabel() : "Not selected";
                String eyeColor = eyeColorChoice.getSelectedItem();
                boolean isTall = tallCheckbox.getState();
                boolean isHeavy = weightCheckbox.getState();
                String athleticAbility = athleticAbilityTextArea.getText().trim();

                System.out.println("Name: " + name);
                System.out.println("Sex: " + sex);
                System.out.println("Eye Color: " + eyeColor);
                System.out.println("Over 6 feet tall: " + isTall);
                System.out.println("Over 200 pounds: " + isHeavy);
                System.out.println("Athletic Ability: " + athleticAbility);

                Dialog dialog = new Dialog(Exno8_GUI.this, "Information Submitted", true);
                dialog.setLayout(new FlowLayout());
                dialog.setSize(300, 150);
                dialog.add(new Label("Your information has been submitted successfully!"));
                Button closeButton = new Button("Close");
                closeButton.addActionListener(event -> dialog.dispose());
                dialog.add(closeButton);
                dialog.setVisible(true);
            }
        });

        this.addWindowListener(new WindowAdapter() {
            @Override
            public void windowClosing(WindowEvent e) {
                System.exit(0);
            }
        });
    }

    public static void main(String[] args) {
        new Exno8_GUI();
    }
}
